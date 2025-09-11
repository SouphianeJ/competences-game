"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Level, Room, SlotType } from "@/lib/types";

type RoomPayload = { room: Room };

export default function RoomPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const [payload, setPayload] = useState<RoomPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [stage, setStage] = useState<number>(0); // 0..3
  const [selection, setSelection] = useState<Record<SlotType, string>>({ A:"",O:"",C:"",E:"" });
  const [sentence, setSentence] = useState<string>("");
  const playerId = useMemo(() => localStorage.getItem("aoce_playerId") || "", []);
  const pollRef = useRef<number | null>(null);

  const fetchRoom = async () => {
    const res = await fetch(`/api/rooms/${code}`, { cache: "no-store" });
    if (res.status === 404) {
      alert("La salle n'existe plus.");
      router.push("/");
      return;
    }
    const data = await res.json();
    setPayload(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoom();
    pollRef.current = window.setInterval(fetchRoom, 1500);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  if (loading || !payload) return <div className="card">Chargement…</div>;

  const room = payload.room;
  const isHost = room.hostId === playerId;

  const handleStart = async () => {
    const res = await fetch(`/api/rooms/${room.code}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId })
    });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || "Erreur");
    }
  };

  const handlePick = (slot: SlotType, id: string) => {
    setSelection((s) => ({ ...s, [slot]: id }));
  };

  const currentSlot = (["A","O","C","E"] as SlotType[])[stage];
  const level: Level = room.level;

  const nextOrFinish = async () => {
    if (!selection[currentSlot]) return alert("Fais un choix");
    if (stage < 3) {
      setStage(stage + 1);
    } else {
      // Build sentence + compute score, then submit
      const sent = buildSentence(level, selection);
      setSentence(sent);
      const score = computeScore(level, selection);
      const res = await fetch(`/api/rooms/${room.code}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, selection })
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Soumission échouée");
      } else {
        alert(`Soumis ! Score (local): ${score}/100`);
      }
    }
  };

  const handleEnd = async () => {
    const res = await fetch(`/api/rooms/${room.code}/end`, { method: "POST" });
    if (!res.ok) alert("Erreur fin de partie");
  };

  const me = room.players.find(p => p.id === playerId);
  const playing = room.status === "playing";
  const ended = room.status === "ended";
  const done = !!me?.done;

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <div className="h">Salle <span className="badge">{room.code}</span></div>
          <div style={{opacity:.8}}>Statut: <b>{room.status}</b> {isHost && <span className="badge">Hôte</span>}</div>
        </div>
        <div>
          {room.status === "lobby" && isHost && (
            <button className="button" onClick={handleStart}>Lancer la partie</button>
          )}
          {room.status !== "ended" && isHost && (
            <button className="button secondary" onClick={handleEnd} style={{ marginLeft: 8 }}>Clôturer</button>
          )}
        </div>
      </div>

      {/* Lobby */}
      {room.status === "lobby" && (
        <>
          <div className="h" style={{ marginTop: 16 }}>Joueurs</div>
          <ul className="list">
            {room.players.map(p => (
              <li key={p.id}>
                <span>{p.name}</span>
                <span className="badge">{p.id === room.hostId ? "Hôte" : "Prêt"}</span>
              </li>
            ))}
          </ul>
          <p style={{opacity:.8}}>Partage le code <b>{room.code}</b> pour que les autres rejoignent.</p>
        </>
      )}

      {/* Jeu */}
      {playing && !done && (
        <>
          <div className="h" style={{ marginTop: 16 }}>Tour {stage+1}/4 — {labelForSlot(currentSlot)}</div>
          <div className="options">
            {level.slots[currentSlot].map(opt => {
              const selected = selection[currentSlot] === opt.id;
              return (
                <div className={`option ${selected ? "selected" : ""}`} key={opt.id} onClick={()=>handlePick(currentSlot, opt.id)}>
                  {opt.text}
                </div>
              );
            })}
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="button" onClick={nextOrFinish}>{stage < 3 ? "Continuer" : "Soumettre"}</button>
          </div>
        </>
      )}

      {/* Après soumission (ou si déjà done) */}
      {(playing && done) && (
        <div style={{ marginTop: 16 }}>
          <div className="h">Merci d'attendre les autres…</div>
          {sentence && <p style={{opacity:.85}}><b>Ta compétence :</b> {sentence}</p>}
        </div>
      )}

      {/* Scoreboard */}
      {(playing || ended) && (
        <>
          <div className="h" style={{ marginTop: 24 }}>Scores</div>
          <ul className="list">
            {room.players
              .slice()
              .sort((a,b)=>(b.score ?? -1) - (a.score ?? -1))
              .map(p => (
              <li key={p.id}>
                <span>{p.name}</span>
                <span>{p.done ? (p.score ?? 0) : <span className="badge">en cours…</span>}</span>
              </li>
            ))}
          </ul>
          {ended && <p style={{opacity:.7}}>Partie terminée. Cette salle sera supprimée automatiquement sous peu.</p>}
        </>
      )}
    </div>
  );
}

function labelForSlot(s: SlotType) {
  return s === "A" ? "Action" : s === "O" ? "Objet" : s === "C" ? "Contexte" : "Évidence / Critère";
}

function computeScore(level: Level, selection: Record<SlotType,string>) {
  let score = 0;
  (["A","O","C","E"] as SlotType[]).forEach(slot => {
    const opt = level.slots[slot].find(o => o.id === selection[slot]);
    if (opt?.isCorrect) score += 25;
  });
  return score;
}

function buildSentence(level: Level, selection: Record<SlotType,string>) {
  const getText = (slot: SlotType) => level.slots[slot].find(o=>o.id===selection[slot])?.text ?? "";
  const map = {
    A: getText("A"),
    O: getText("O"),
    C: getText("C"),
    E: getText("E")
  };
  return `${map.A} ${map.O} ${map.C} ${map.E}.`.replace(/\s+/g,' ').trim();
}

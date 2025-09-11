"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("aoce_name");
    if (stored) setName(stored);
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return alert("Entre un nom");
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (!res.ok) return alert("Erreur création salle");
    const data = await res.json();
    localStorage.setItem("aoce_name", name);
    localStorage.setItem("aoce_playerId", data.playerId);
    router.push(`/room/${data.code}`);
  };

  const handleJoin = async () => {
    if (!name.trim() || !joinCode.trim()) return alert("Nom et code requis");
    const res = await fetch(`/api/rooms/${joinCode.toUpperCase()}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.error || "Erreur rejoindre");
    localStorage.setItem("aoce_name", name);
    localStorage.setItem("aoce_playerId", data.playerId);
    router.push(`/room/${joinCode.toUpperCase()}`);
  };

  return (
    <div className="card">
      <h1 className="h">AOCE — 4 tours, 1 choix par tour</h1>
      <p style={{opacity:.8, marginBottom:12}}>Crée une salle (hôte) ou rejoins avec un code.</p>
      <div className="row" style={{ marginBottom: 12 }}>
        <input className="input" placeholder="Ton nom" value={name} onChange={e=>setName(e.target.value)} />
        <button className="button" onClick={handleCreate}>Créer une salle</button>
      </div>
      <div className="row">
        <input className="input" placeholder="Code salle (4 chars)" maxLength={4} value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase())} />
        <button className="button secondary" onClick={handleJoin}>Rejoindre</button>
      </div>
    </div>
  );
}

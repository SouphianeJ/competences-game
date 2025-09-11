import { NextResponse } from "next/server";
import { roomsCol } from "@/lib/db";
import type { SlotType } from "@/lib/types";

export async function POST(req: Request, { params }: { params: { code: string }}) {
  const { playerId, selection } = await req.json() as { playerId: string, selection: Record<SlotType,string> };

  if (!playerId || !selection) return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });

  const code = params.code.toUpperCase();
  const rooms = await roomsCol();
  const room = await rooms.findOne({ code, status: { $in: ["playing", "ended"] } });
  if (!room) return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });

  // recalcul du score côté serveur
  let score = 0;
  (["A","O","C","E"] as SlotType[]).forEach(slot => {
    const opt = room.level.slots[slot].find((o:any) => o.id === selection[slot]);
    if (opt?.isCorrect) score += 25;
  });

  await rooms.updateOne(
    { code, "players.id": playerId },
    { $set: { "players.$.score": score, "players.$.done": true } }
  );

  return NextResponse.json({ ok: true, score });
}

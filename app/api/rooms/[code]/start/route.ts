import { roomsCol } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { code: string }}) {
  const { playerId } = await req.json();
  const code = params.code.toUpperCase();
  const rooms = await roomsCol();
  const room = await rooms.findOne({ code });
  if (!room) return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });
  if (room.status !== "lobby") return NextResponse.json({ error: "Déjà démarrée" }, { status: 400 });
  if (room.hostId !== playerId) return NextResponse.json({ error: "Seul l'hôte peut démarrer" }, { status: 403 });

  await rooms.updateOne({ code }, { $set: { status: "playing", startAt: new Date() } });
  return NextResponse.json({ ok: true });
}

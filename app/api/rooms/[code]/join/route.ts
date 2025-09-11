import { roomsCol } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { code: string }}) {
  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }
  const code = params.code.toUpperCase();
  const rooms = await roomsCol();
  const room = await rooms.findOne({ code });
  if (!room || room.status !== "lobby") {
    return NextResponse.json({ error: "Salle introuvable ou déjà démarrée" }, { status: 404 });
  }
  if (room.players.some((p:any)=>p.name === name)) {
    return NextResponse.json({ error: "Nom déjà pris" }, { status: 400 });
  }
  const playerId = crypto.randomUUID();
  await rooms.updateOne({ code }, { $push: { players: { id: playerId, name, done: false } } });
  return NextResponse.json({ playerId });
}

import { NextResponse } from "next/server";
import { roomsCol, ensureTTLIndex } from "@/lib/db";
import { pickLevel } from "@/lib/level";

function code4() {
  // base36 sur 4 chars (A-Z 0-9), uppercase
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }

  const rooms = await roomsCol();
  await ensureTTLIndex();

  const level = pickLevel();
  const now = new Date();
  const playerId = crypto.randomUUID();
  const code = code4();

  const room = {
    code,
    status: "lobby" as const,
    hostId: playerId,
    players: [{ id: playerId, name, score: 0, done: false }],
    level,
    createdAt: now,
    expiresAt: new Date(now.getTime() + 60 * 60 * 1000) // purge automatique 1h par défaut
  };

  await rooms.insertOne(room as any);

  return NextResponse.json({ code, playerId, room: { ...room, _id: undefined } });
}

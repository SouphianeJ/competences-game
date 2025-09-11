import { roomsCol } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(_: Request, { params }: { params: { code: string }}) {
  const code = params.code.toUpperCase();
  const rooms = await roomsCol();
  const room = await rooms.findOne({ code });
  if (!room) return NextResponse.json({ error: "Salle introuvable" }, { status: 404 });

  const expiresAt = new Date(Date.now() + 60_000); // purge dans ~60s
  await rooms.updateOne({ code }, { $set: { status: "ended", endAt: new Date(), expiresAt } });
  return NextResponse.json({ ok: true });
}

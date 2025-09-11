import { roomsCol } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { code: string }}) {
  const rooms = await roomsCol();
  const room = await rooms.findOne({ code: params.code.toUpperCase() });
  if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // On renvoie tel quel (POC) ; le level contient les réponses correctes.
  return NextResponse.json({ room });
}

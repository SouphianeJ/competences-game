import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  // Get all rooms
  return NextResponse.json({ rooms: [] });
}

export async function POST(request: NextRequest) {
  // Create a new room
  const body = await request.json();
  return NextResponse.json({ success: true, room: body });
}
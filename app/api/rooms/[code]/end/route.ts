import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    code: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { code } = params;
  
  // End game logic
  return NextResponse.json({ 
    success: true,
    message: `Game ended for room ${code}`,
    gameState: 'ended'
  });
}
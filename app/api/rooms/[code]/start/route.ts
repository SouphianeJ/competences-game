import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    code: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { code } = params;
  
  // Start game logic
  return NextResponse.json({ 
    success: true,
    message: `Game started for room ${code}`,
    gameState: 'started'
  });
}
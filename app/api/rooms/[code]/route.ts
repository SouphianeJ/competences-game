import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    code: string;
  };
}

// GET état room
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { code } = params;
  
  // Get room state by code
  return NextResponse.json({ 
    code,
    state: 'waiting',
    players: [],
    currentLevel: null
  });
}
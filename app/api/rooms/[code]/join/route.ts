import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    code: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { code } = params;
  const body = await request.json();
  
  // Join room logic
  return NextResponse.json({ 
    success: true,
    message: `Joined room ${code}`,
    player: body
  });
}
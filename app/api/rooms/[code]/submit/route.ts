import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    code: string;
  };
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { code } = params;
  const body = await request.json();
  
  // Submit answer logic
  return NextResponse.json({ 
    success: true,
    message: `Answer submitted for room ${code}`,
    submission: body
  });
}
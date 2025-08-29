import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Clear the auth cookie
    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.delete('auth_token');
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    );
  }
}
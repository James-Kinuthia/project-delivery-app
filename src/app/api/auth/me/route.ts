import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    // Get user from token
    const user = await AuthService.getUserFromToken(token);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid token' },
        
        { status: 401 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Failed to get user info' },
      { status: 401 }
    );
  }
}
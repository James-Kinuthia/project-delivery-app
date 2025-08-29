// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token =
      request.cookies.get('auth_token')?.value ||
      request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    // Validate token and get user
    const user = await AuthService.getUserFromToken(token);

    if (!user) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // ✅ Wrap response in { user }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ message: 'Failed to get user info' }, { status: 401 });
  }
}

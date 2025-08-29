import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';
import { RegisterData } from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterData = await request.json();
    
    // Validate request body
    if (!body.email || !body.password || !body.firstName || !body.lastName) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (body.password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Register user
    const authResponse = await AuthService.register(body);
    
    // Set HTTP-only cookie
    const response = NextResponse.json(authResponse);
    response.cookies.set('auth_token', authResponse.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Registration failed' },
      { status: 400 }
    );
  }
}
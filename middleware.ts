import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth-service';

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/profile', '/admin', '/api/protected'];
const adminRoutes = ['/admin'];
const managerRoutes = ['/analytics', '/departments'];

// Routes that should redirect authenticated users
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies or Authorization header
  const token = request.cookies.get('auth_token')?.value || 
                request.headers.get('Authorization')?.replace('Bearer ', '');

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isManagerRoute = managerRoutes.some(route => pathname.startsWith(route));

  // Handle unauthenticated requests to protected routes
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle authenticated requests
  if (token) {
    try {
      const payload = AuthService.verifyToken(token);
      const userRoles = payload.roles || [];

      // Redirect authenticated users away from auth pages
      if (isAuthRoute) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Check admin access
      if (isAdminRoute && !userRoles.includes('admin')) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Check manager access (managers and admins can access)
      if (isManagerRoute && !userRoles.includes('manager') && !userRoles.includes('admin')) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      // Add user info to headers for API routes
      if (pathname.startsWith('/api/')) {
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-user-id', payload.userId);
        requestHeaders.set('x-user-email', payload.email);
        requestHeaders.set('x-user-roles', JSON.stringify(userRoles));
        requestHeaders.set('x-user-permissions', JSON.stringify(payload.permissions));

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      }
    } catch (error) {
      // Invalid token - redirect to login for protected routes
      if (isProtectedRoute) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('auth_token');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
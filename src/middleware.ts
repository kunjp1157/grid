
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user');
  const { pathname } = request.nextUrl;

  // If trying to access a protected route without a user cookie, redirect to login
  if (!userCookie && (pathname.startsWith('/admin') || pathname.startsWith('/dashboard'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If user cookie exists, parse it to check the role
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie.value);
      
      // If an admin tries to access citizen dashboard, redirect to admin dashboard
      if (user.role === 'admin' && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      
      // If a citizen tries to access admin dashboard, redirect to citizen dashboard
      if (user.role === 'citizen' && pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (e) {
      // If cookie is malformed, treat as unauthenticated
      if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
        const response = NextResponse.redirect(new URL('/', request.url));
        response.cookies.delete('user');
        return response;
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*'],
}

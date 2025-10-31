import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    // Add security headers to hide API implementation details
    response.headers.set('X-Robots-Tag', 'noindex');
    response.headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

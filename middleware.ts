import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that don't require authentication
const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

// Routes that are public (API routes for tracking)
const publicApiRoutes = ['/api/track'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow public API routes
  if (publicApiRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow all API routes (they have their own auth handling if needed)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase is not configured, allow access (development mode)
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  // Get all cookies that might contain Supabase auth
  const cookies = request.cookies.getAll();
  const hasAuthCookie = cookies.some(cookie => 
    cookie.name.includes('supabase') || 
    cookie.name.includes('sb-') ||
    cookie.name.includes('auth-token')
  );

  // If no auth cookie and trying to access protected route, redirect to login
  if (!hasAuthCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|assests|public|api).*)',
  ],
};

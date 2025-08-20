import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  
  // Check if this is a session callback from NextAuth
  const isAuthCallback = pathname.includes('/api/auth/callback') || 
                          pathname.includes('/api/auth/session');
  
  // If this is an auth callback, let it pass through
  if (isAuthCallback) {
    return NextResponse.next();
  }
  
  // Protected routes check
  if (!token) {
    if (pathname.startsWith("/account")) {
      // Store the original URL to redirect back after login
      const callbackUrl = encodeURIComponent(req.nextUrl.href);
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, req.url));
    }
  } else {
    // User is logged in
    console.log('Usuario logeado');
    
    if (pathname.startsWith("/login") || pathname.startsWith("/registration")) {
      return NextResponse.redirect(new URL("/account", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*", 
    "/registration/:path*", 
    "/login",
    "/api/auth/callback/:path*"
  ],
};
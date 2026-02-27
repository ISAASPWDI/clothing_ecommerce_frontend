import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthCallback =
    pathname.includes("/api/auth/callback") ||
    pathname.includes("/api/auth/session");


  const isPaymentCallback =
    pathname.startsWith("/checkout/success") ||
    pathname.startsWith("/checkout/failure") ||
    pathname.startsWith("/checkout/pending");

  if (isAuthCallback || isPaymentCallback) {
    return NextResponse.next();
  }

  // Si NO hay token (usuario no logueado)
  if (!token) {
    if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
      const callbackUrl = encodeURIComponent(req.nextUrl.href);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
      );
    }
  } else {
    // ✅ Usuario logueado
    console.log("Usuario logeado");

    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/registration") ||
      pathname.startsWith("/fallbackUser")
    ) {
      return NextResponse.redirect(new URL("/account", req.url));
    }

    // Protección adicional para checkout (excepto callbacks de pago)
    if (pathname.startsWith("/checkout") && !isPaymentCallback) {
      const cartCookie = req.cookies.get('cart');
      
      if (!cartCookie) {
        return NextResponse.redirect(new URL("/shop", req.url));
      }

      try {
        const cartData = JSON.parse(cartCookie.value);
        
        if (!cartData.items || cartData.items.length === 0) {
          return NextResponse.redirect(new URL("/cart", req.url));
        }
      } catch (error) {
        console.error("Error parsing cart cookie:", error);
        return NextResponse.redirect(new URL("/shop", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/registration/:path*",
    "/login",
    "/fallbackUser",
    "/checkout/:path*",
    "/api/auth/callback/:path*",
  ],
};
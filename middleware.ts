import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthCallback =
    pathname.includes("/api/auth/callback") ||
    pathname.includes("/api/auth/session");

  if (isAuthCallback) {
    return NextResponse.next();
  }

  // Si NO hay token (usuario no logueado)
  if (!token) {
    if (pathname.startsWith("/account") || pathname.startsWith("/checkout")) {
      // Guardamos callbackUrl para volver luego
      const callbackUrl = encodeURIComponent(req.nextUrl.href);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
      );
    }
  } else {
    // ✅ Usuario logueado
    console.log("Usuario logeado");

    // Si intenta entrar a login, registro o fallback → mándalo al account
    if (
      pathname.startsWith("/login") ||
      pathname.startsWith("/registration") ||
      pathname.startsWith("/fallbackUser")
    ) {
      return NextResponse.redirect(new URL("/account", req.url));
    }

    // Protección adicional para checkout: verificar si hay items en el carrito
    if (pathname.startsWith("/checkout")) {
      // Obtener el carrito desde las cookies o headers
      const cartCookie = req.cookies.get('cart');
      
      if (!cartCookie) {
        // Si no hay cookie del carrito, redirigir al shop
        return NextResponse.redirect(new URL("/shop", req.url));
      }

      try {
        const cartData = JSON.parse(cartCookie.value);
        
        // Si el carrito está vacío, redirigir al carrito
        if (!cartData.items || cartData.items.length === 0) {
          return NextResponse.redirect(new URL("/cart", req.url));
        }
      } catch (error) {
        // Si hay error al parsear el carrito, redirigir al shop
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
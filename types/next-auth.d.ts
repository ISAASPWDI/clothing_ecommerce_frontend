// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      rol: string;
      authType: string;
      phone?: string | null;
    };
    accessToken?: string; // 💡 Aquí añadimos el token en la sesión
  }

  interface User {
    id: string;
    firstName: string;
    lastName?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    rol: string;
    authType: string;
    phone?: string | null;
    token?: string; // 💡 Añadimos el token en el User (lo retorna el authorize)
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    firstName: string;
    lastName?: string | null;
    rol?: string;
    authType?: string;
    phone?: string | null;
    accessToken?: string; // 💡 Añadimos el token en el JWT
  }
}

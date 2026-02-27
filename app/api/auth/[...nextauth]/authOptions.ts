import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import client from "../../../../apolloClient";
import { CREATE_USER, FIND_USER_BY_EMAIL, LOGIN_USER } from "@/app/queriesGraphQL";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { data } = await client.query({
            query: LOGIN_USER,
            variables: {
              email: credentials?.email,
              password: credentials?.password,
            },
            fetchPolicy: "network-only",
          });

          if (data.findUserByEmail) {
            const user = data.findUserByEmail;
            return {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              name: user.name,
              email: user.email,
              image: user.image || "",
              rol: user.rol,
              authType: user.authType,
              phone: user.phone || "",
              token: user.token,
            };
          }

          return null;
        } catch (error) {
          console.error("Error in credentials authorization:", error);
          return null;
        }
      }
    }),
  ],
  

  // useSecureCookies: false,
  
  // cookies: {
  //   sessionToken: {
  //     name: `next-auth.session-token`,
  //     options: {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       path: '/',
  //       secure: false,
  //     },
  //   },
  // },
  
  callbacks: {
    async signIn({ user, account }) {
      let dbUser = null;

      if (account?.provider === "google") {
        try {
          console.log("Fetching user with email:", user.email);
          const { data } = await client.query({
            query: FIND_USER_BY_EMAIL,
            variables: { email: user.email },
            fetchPolicy: "network-only",
          });
          console.log("GraphQL response:", data);
          dbUser = data.getUserByEmail;

          if (!dbUser) {
            const firstName = user.name?.split(" ")[0] || "";
            const lastName = user.name?.split(" ").slice(1).join(" ") || "";

            const createResult = await client.mutate({
              mutation: CREATE_USER,
              variables: {
                data: {
                  firstName,
                  lastName,
                  password: "",
                  phone: "",
                  authType: "PROVIDER",
                  rol: "USER",
                  name: user.name,
                  email: user.email,
                  image: user.image || "",
                },
              },
            });

            dbUser = createResult.data.createUser;
            console.log("Created new Google user:", dbUser);
          } else {
            console.log("Google user already exists:", dbUser);
          }

          user.id = dbUser.id;
          user.firstName = dbUser.firstName;
          user.lastName = dbUser.lastName;
          user.phone = dbUser.phone;
          user.authType = dbUser.authType;
          user.rol = dbUser.rol;
          user.token = dbUser.token;
        } catch (error) {
          console.error("Error in Google signIn:", error);
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user, trigger }) {
      console.log("JWT callback triggered:", trigger);
    
      if (user) {
        token.userId    = user.id;
        token.firstName = user.firstName;
        token.lastName  = user.lastName;
        token.rol       = user.rol;
        token.authType  = user.authType;
        token.phone     = user.phone;
        token.accessToken = user.token;
      }
    
      try {
        const { data } = await client.query({
          query: FIND_USER_BY_EMAIL,
          variables: { email: user?.email || token.email },
          fetchPolicy: "network-only"
        });
    
        const u = data?.getUserByEmail;
        if (u) {
          token.firstName   = u.firstName;
          token.lastName    = u.lastName;
          token.phone       = u.phone;
          token.name = u.name;
          token.accessToken = u.token;
        }
      } catch (err) {
        console.error("Error fetching user in JWT callback:", err);
      }
    
      console.log("Final token:", token);
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback with token:", { ...token });

      if (!session.user) {
        session.user = {
          id: "",
          firstName: "",
          lastName: "",
          name: "",
          email: token.email,
          image: "",
          rol: "USER",
          authType: "PROVIDER",
          phone: "",
        };
      }
      session.accessToken = token.accessToken;
      session.user.id = token.userId || token.sub || "";
      session.user.firstName = token.firstName || "";
      session.user.lastName = token.lastName || "";
      session.user.rol = token.rol || "USER";
      session.user.authType = token.authType || "PROVIDER";
      session.user.phone = token.phone || "";

      console.log("Final session state:", {
        user: { ...session.user },
        accessToken: session.accessToken
      });

      return session;
    }
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  session: {
    strategy: 'jwt',
  },
  
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
}
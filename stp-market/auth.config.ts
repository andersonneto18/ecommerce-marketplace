import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string } | undefined)?.role;
      const { pathname } = nextUrl;

      if (pathname.startsWith("/admin")) {
        const isLoginPage = pathname === "/admin/login";

        if (isLoginPage) {
          if (isLoggedIn && role === "ADMIN") {
            return Response.redirect(new URL("/admin/dashboard", nextUrl));
          }
          return true;
        }

        return isLoggedIn && role === "ADMIN";
      }

      if (pathname.startsWith("/fornecedor")) {
        const isLoginPage = pathname === "/fornecedor/login";

        if (isLoginPage) {
          if (isLoggedIn && role === "VENDOR") {
            return Response.redirect(new URL("/fornecedor/painel", nextUrl));
          }
          return true;
        }

        return isLoggedIn && role === "VENDOR";
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

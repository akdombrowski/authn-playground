import "next-auth/jwt";
import NextAuth, { DefaultSession, User } from "next-auth";

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
    /** The user's role. */
    userRole?: "admin";
  }
}
declare module "next-auth" {
  interface Session {
    user: User & DefaultSession["user"];
    accessToken: JWT;
  }
}

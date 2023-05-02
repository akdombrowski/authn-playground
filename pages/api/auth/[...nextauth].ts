import NextAuth, { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import Auth0Provider from "next-auth/providers/auth0";

import { XataAdapter } from "@next-auth/xata-adapter";
import { XataClient } from "../../../db/xata"; // or wherever you've chosen to create the client

import sendVerReq from "../../../email/sendEmailVerificationRequest";

import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const client = new XataClient();

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  adapter: XataAdapter(client),
  providers: [
    EmailProvider({
      id: "email",
      type:"email",
      name: "email",
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 30 * 60, // How long email links are valid for (30 min)
      normalizeIdentifier(identifier: string): string {
        const window = new JSDOM("").window;
        const purify = DOMPurify(window);
        const cleanIdentifier = purify.sanitize(identifier);

        // Get the first two elements only,
        // separated by `@` from user input.
        let [local, domain] = cleanIdentifier.toLowerCase().trim().split("@");
        // The part before "@" can contain a ","
        // but we remove it on the domain part
        domain = domain.split(",")[0];
        return `${local}@${domain}`;
      },
      sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
        theme,
      }) {
        const provider = { server, from };
        sendVerReq({ email, url, provider, theme });
      },
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
      version: "2.0",
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 5 * 60, // 5 min
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
  debug: process.env.DEBUG ?? false,
  logger: {
    error(code, metadata) {
      console.log(code, metadata);
    },
    warn(code) {
      console.log(code);
    },
    debug(code, metadata) {
      console.log(code, metadata);
    },
  },
  pages: {
    signIn: "/login",
  },
  theme: {
    colorScheme: "dark",
    brandColor: "#283845",
    logo: "https://i.postimg.cc/HxhXYXj2/double-Trouble.webp",
    buttonText: "#99FFAC",
  },
};

export default NextAuth(authOptions);

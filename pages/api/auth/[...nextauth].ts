import NextAuth, {
  NextAuthOptions,
  Session,
  User,
  Account,
  Profile,
  RequestInternal,
} from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import Auth0Provider from "next-auth/providers/auth0";

import { JWT } from "next-auth/jwt";

import { XataAdapter } from "@next-auth/xata-adapter";
import { XataClient } from "../../../db/xata"; // or wherever you've chosen to create the client

import sendVerReq from "../../../email/sendEmailVerificationRequest";

import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import Credentials from "next-auth/providers/credentials";

const client = new XataClient();

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions: NextAuthOptions = {
  // set env var if want to turn on debug and don't commit the env file to git
  debug: (process.env.DEBUG as unknown as boolean) ?? false,
  adapter: XataAdapter(client),
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    // allow email magic link login using sendinblue
    EmailProvider({
      id: "email",
      type: "email",
      name: "email",
      server: process.env.EMAIL_SERVER as string,
      from: process.env.EMAIL_FROM as string,
      maxAge: 30 * 60, // How long email links are valid for (30 min)
      normalizeIdentifier(identifier: string): string {
        const window = new JSDOM("").window;
        const purify = DOMPurify(window);
        const cleanIdentifier = purify.sanitize(identifier);

        // Get the first two elements only,
        // separated by `@` from user input.
        // this is default code from next-auth
        // they explicitly mention it's not strictly correct to convert to
        // lowercase, but it tends to be how people expect or know how to use
        // email addresses
        let [local, domain] = cleanIdentifier.toLowerCase().trim().split("@");
        // The part before "@" can contain a ","
        // but we remove it on the domain part
        // aka they might've provided a list of emails
        if (process.env.DEBUG && domain.includes(",")) {
          console.error("domain contains a ','. stripping it out.");
          console.error("domain", domain);
          domain = domain.split(",")[0];
        }

        return `${local}@${domain}`;
      },
      sendVerificationRequest({
        identifier: email,
        url,
        provider: { server, from },
        theme,
      }) {
        server = server as string;
        from = from as string;
        const provider = { server, from };
        sendVerReq({ email, url, provider, theme });
      },
    }),
    Credentials({
      id: "webauthn",
      name: "WebAuthn",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "emailaddress@example.com",
        },
        pubKeyCred: {
          label: "WebAuthn Public Key Credential",
          type: "hidden",
        },
      },
      async authorize(
        credentials: Record<string, string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">
      ): Promise<any> {
        if (process.env.DEBUG) {
          console.log("");
          console.log("in Credentials Provider authorize func");
          console.log("");
          console.log("credentials");
          console.log(credentials);
          console.log("");
          console.log(JSON.stringify(credentials?.result));
          console.log("");
          console.log("req");
          console.log(req);
        }
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
    strategy: "jwt",
    maxAge: 5 * 60, // 5 min
  },
  jwt: {
    maxAge: 5 * 60, // 5 min
  },
  callbacks: {
    async jwt({
      token,
      user,
      account,
    }: {
      token: JWT;
      user: User;
      account: Account | null;
    }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account?.access_token;
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: Session;
      token: JWT;
      user: User;
    }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token?.accessToken;
      return session;
    },
  },
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

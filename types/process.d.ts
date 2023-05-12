declare namespace NodeJS {
  export interface ProcessEnv {
    EMAIL_API_KEY: string;
    EMAIL_FROM: string;
    EMAIL_SERVER: string;
    DEBUG: boolean;
    RP_ID: string;
    RP_NAME: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;
    FACEBOOK_ID: string;
    FACEBOOK_SECRET: string;
    TWITTER_ID: string;
    TWITTER_SECRET: string;
    GOOGLE_ID: string;
    GOOGLE_SECRET: string;
    AUTH0_ID: string;
    AUTH0_SECRET: string;
  }
}

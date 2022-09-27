export const __DEV_MODE__ = process.env.NODE_ENV === "development";

export const DOMAIN = __DEV_MODE__
  ? "http://localhost:3000"
  : "https://asatic-cms.vercel.app";

export const EMAIL_SIGNIN_KEY = "emailForSignIn";
export const AUTH_PERSISTENCE_KEY = "authPersistenceKey";

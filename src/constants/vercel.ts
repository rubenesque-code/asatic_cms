export const FRONTEND_PROJECT_ID =
  process.env.NEXT_PUBLIC_FIREBASE_FRONTEND_PROJECT_ID;

export const AUTH_KEY = process.env.NEXT_PUBLIC_VERCEL_AUTH_KEY;

export const FRONTEND_DEPLOY_HOOK_KEY =
  process.env.NEXT_PUBLIC_VERCEL_FRONTEND_HOOK_KEY;
export const FRONTEND_DEPLOY_HOOK = `https://api.vercel.com/v1/integrations/deploy/${FRONTEND_PROJECT_ID}/${FRONTEND_DEPLOY_HOOK_KEY}`;

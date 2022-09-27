export const ROUTES = {
  ARTICLES: "articles",
  AUTHORS: "authors",
  BLOGS: "blogs",
  COLLECTIONS: "collections",
  IMAGES: "images",
  LANGUAGES: "languages",
  LANDING: "landing",
  RECORDEDEVENTS: "recorded-events",
  SUBJECTS: "subjects",
  TAGS: "tags",
  SIGNIN: "login",
  EMAIL_SIGNIN_REDIRECT: "email-signin-redirect",
} as const;

type Routes = typeof ROUTES;
type RouteKey = keyof Routes;
export type RouteValue = Routes[RouteKey];

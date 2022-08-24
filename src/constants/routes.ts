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
} as const;

type Routes = typeof ROUTES;
type RouteKey = keyof Routes;
export type RouteValue = Routes[RouteKey];

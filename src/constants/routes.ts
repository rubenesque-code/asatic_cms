export const ROUTES = {
  ARTICLES: {
    label: "articles",
    get route() {
      return `/${this.label}` as const;
    },
  },
  BLOGS: {
    label: "blogs",
    get route() {
      return `/${this.label}` as const;
    },
  },
  COLLECTIONS: {
    label: "collections",
    get route() {
      return `/${this.label}` as const;
    },
  },
  IMAGES: {
    label: "images",
    get route() {
      return `/${this.label}` as const;
    },
  },
  LANDING: {
    label: "landing",
    get route() {
      return `/${this.label}` as const;
    },
  },
  LANGUAGES: {
    label: "languages",
    get route() {
      return `/${this.label}` as const;
    },
  },
  RECORDEDEVENTS: {
    label: "recorded events",
    route: "/recorded-events",
  },
  SUBJECTS: {
    label: "subjects",
    get route() {
      return `/${this.label}` as const;
    },
  },
  TAGS: {
    label: "tags",
    get route() {
      return `/${this.label}` as const;
    },
  },
  SIGNIN: "login",
  EMAIL_SIGNIN_REDIRECT: "email-signin-redirect",
} as const;

export type Routes = typeof ROUTES;
export type RouteKey = keyof Routes;
export type ExtractRouteKey<TRouteKey extends RouteKey> = Extract<
  RouteKey,
  TRouteKey
>;

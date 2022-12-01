import { EntityNameSubSet } from "^types/entity";

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
  RECORDEDEVENTS: {
    label: "video documents",
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
  AUTHORS: {
    label: "authors",
    get route() {
      return `/${this.label}` as const;
    },
  },
  RECORDEDEVENTTYPES: {
    label: "video document type",
    get route() {
      return `recorded-event-types` as const;
    },
  },
  SIGNIN: "login",
  EMAIL_SIGNIN_AUTHORISATION: "email-signin-authorisation",
} as const;

export type Routes = typeof ROUTES;
export type RouteKey = keyof Routes;
export type ExtractRouteKey<TRouteKey extends RouteKey> = Extract<
  RouteKey,
  TRouteKey
>;

type NonAuthRoutes = Omit<Routes, "SIGNIN" | "EMAIL_SIGNIN_AUTHORISATION">;
type RouteRoute = NonAuthRoutes[keyof NonAuthRoutes]["route"];

type EntityWithOwnPageName = EntityNameSubSet<
  "article" | "blog" | "collection" | "recordedEvent" | "subject"
>;
export const EntityNameToRoute: { [k in EntityWithOwnPageName]: RouteRoute } = {
  article: ROUTES.ARTICLES.route,
  blog: ROUTES.BLOGS.route,
  collection: ROUTES.COLLECTIONS.route,
  recordedEvent: ROUTES.RECORDEDEVENTS.route,
  subject: ROUTES.SUBJECTS.route,
};

// todo: this also refers to 'collections (in landing)' so needs to be somewhere else now.
export type ContentStatus<TContentSpecificError extends string> =
  | "new"
  | "draft"
  | "good"
  | "invalid"
  | { status: "error"; errors: TContentSpecificError[] };

// export type PrimaryDisplayContent =
export type PrimaryContent = "articles" | "blogs" | "recorded-events";

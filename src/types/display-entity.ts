export type DisplayEntityStatus<TContentSpecificError extends string> =
  | "new"
  | "draft"
  | "good"
  | "invalid"
  | { status: "error"; errors: TContentSpecificError[] };

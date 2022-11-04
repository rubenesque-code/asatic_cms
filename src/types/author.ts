import { EntityGlobalFields, RelatedDisplayEntityFields } from "./entity";
import { Translations } from "./entity-translation";

export type Author = EntityGlobalFields<"author"> &
  Translations<AuthorTranslation> &
  RelatedDisplayEntityFields<"article" | "blog" | "recordedEvent">;

export type AuthorTranslation = { name: string };

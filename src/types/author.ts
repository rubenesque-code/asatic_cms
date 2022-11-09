import { EntityGlobalFields, RelatedDisplayEntityFields } from "./entity";
import { TranslationField, Translations } from "./entity-translation";

export type Author = EntityGlobalFields<"author"> &
  Translations<AuthorTranslation> &
  RelatedDisplayEntityFields<"article" | "blog" | "recordedEvent">;

export type AuthorTranslation = TranslationField<"name">;

/*
const author: Author = {
  articlesIds: [],
  blogsIds: [],
  id: '',
  recordedEventsIds: [],
  translations: [{id: '', languageId: '', name: ''}],
  type: 'author'
}
*/

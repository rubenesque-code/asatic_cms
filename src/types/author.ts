import {
  EntityGlobalFields,
  EntityNameSubSet,
  RelatedDisplayEntityFields,
} from "./entity";
import { TranslationField, Translations } from "./entity-translation";

export type Author = EntityGlobalFields<"author"> &
  Translations<AuthorTranslationFields> &
  RelatedDisplayEntityFields<AuthorRelatedEntity>;

export type AuthorRelatedEntity = EntityNameSubSet<
  "article" | "blog" | "recordedEvent"
>;

type AuthorTranslationFields = TranslationField<"name">;

export type AuthorTranslation = Author["translations"][number];

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

/* const t: AuthorTranslation = {
 id: '',
 languageId: '',
 name?: ''
} */

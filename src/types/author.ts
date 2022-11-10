import {
  EntityGlobalFields,
  EntityNameSubSet,
  RelatedDisplayEntityFields,
} from "./entity";
import { TranslationField, Translations } from "./entity-translation";

export type Author = EntityGlobalFields<"author"> &
  Translations<AuthorTranslation> &
  RelatedDisplayEntityFields<AuthorRelatedEntity>;

export type AuthorRelatedEntity = EntityNameSubSet<
  "article" | "blog" | "recordedEvent"
>;

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

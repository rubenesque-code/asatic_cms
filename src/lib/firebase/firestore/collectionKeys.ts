// import { ValueOf } from "^types/utilities";

export enum Collection {
  ARTICLES = "articles",
  AUTHORS = "authors",
  IMAGES = "images",
  LANGUAGES = "languages",
  TAGS = "tags",
  LANDING = "landing",
  RECORDEDEVENTS = "videos",
  SUBJECTS = "subjects",
}

/* export const COLLECTIONS = {
  ARTICLES: Collection.ARTICLES,
  AUTHORS: Collection.AUTHORS,
  IMAGES: "images",
  LANGUAGES: "languages",
  TAGS: "tags",
} as const;

export type CollectionName = ValueOf<typeof COLLECTIONS>;


export type CollectionNameDictionary<T> = {
  [key in CollectionName]: T;
};

const a: CollectionNameDictionary<string> = {
  articles: 'hello',
}

console.log(a);

 */

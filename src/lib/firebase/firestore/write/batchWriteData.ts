import { WriteBatch } from "firebase/firestore/lite";

import { Article } from "^types/article";
import { Author } from "^types/author";
import { Collection } from "^types/collection";
import { Image } from "^types/image";
import { Tag } from "^types/tag";
import { Language } from "^types/language";
import { LandingSection } from "^types/landing";
import { getDocRef } from "../getRefs";
import { Subject } from "^types/subject";

import { Collection as CollectionKeys } from "../collectionKeys";

export const batchSetArticle = (batch: WriteBatch, article: Article) => {
  const docRef = getDocRef(CollectionKeys.ARTICLES, article.id);
  batch.set(docRef, article);
};

const batchDeleteArticle = (batch: WriteBatch, articleId: string) => {
  const docRef = getDocRef(CollectionKeys.ARTICLES, articleId);
  batch.delete(docRef);
};

export const batchWriteArticles = (
  batch: WriteBatch,
  articles: {
    deleted: string[];
    newAndUpdated: Article[];
  }
) => {
  for (let i = 0; i < articles.newAndUpdated.length; i++) {
    const article = articles.newAndUpdated[i];
    batchSetArticle(batch, article);
  }

  for (let i = 0; i < articles.deleted.length; i++) {
    const articleId = articles.deleted[i];
    batchDeleteArticle(batch, articleId);
  }
};

const batchSetAuthor = (batch: WriteBatch, author: Author) => {
  const docRef = getDocRef(CollectionKeys.AUTHORS, author.id);
  batch.set(docRef, author);
};

const batchDeleteAuthor = (batch: WriteBatch, authorId: string) => {
  const docRef = getDocRef(CollectionKeys.AUTHORS, authorId);
  batch.delete(docRef);
};

export const batchWriteAuthors = (
  batch: WriteBatch,
  authors: {
    deleted: string[];
    newAndUpdated: Author[];
  }
) => {
  for (let i = 0; i < authors.newAndUpdated.length; i++) {
    const author = authors.newAndUpdated[i];
    batchSetAuthor(batch, author);
  }

  for (let i = 0; i < authors.deleted.length; i++) {
    const authorId = authors.deleted[i];
    batchDeleteAuthor(batch, authorId);
  }
};

const batchSetTag = (batch: WriteBatch, tag: Tag) => {
  const docRef = getDocRef(CollectionKeys.TAGS, tag.id);
  batch.set(docRef, tag);
};

const batchDeleteTag = (batch: WriteBatch, tagId: string) => {
  const docRef = getDocRef(CollectionKeys.TAGS, tagId);
  batch.delete(docRef);
};

export const batchWriteTags = (
  batch: WriteBatch,
  tags: {
    deleted: string[];
    newAndUpdated: Tag[];
  }
) => {
  for (let i = 0; i < tags.newAndUpdated.length; i++) {
    const tag = tags.newAndUpdated[i];
    batchSetTag(batch, tag);
  }

  for (let i = 0; i < tags.deleted.length; i++) {
    const tagId = tags.deleted[i];
    batchDeleteTag(batch, tagId);
  }
};

const batchSetCollection = (batch: WriteBatch, collection: Collection) => {
  const docRef = getDocRef(CollectionKeys.COLLECTIONS, collection.id);
  batch.set(docRef, collection);
};

const batchDeleteCollection = (batch: WriteBatch, collectionId: string) => {
  const docRef = getDocRef(CollectionKeys.COLLECTIONS, collectionId);
  batch.delete(docRef);
};

export const batchWriteCollections = (
  batch: WriteBatch,
  collections: {
    deleted: string[];
    newAndUpdated: Collection[];
  }
) => {
  for (let i = 0; i < collections.newAndUpdated.length; i++) {
    const collection = collections.newAndUpdated[i];
    batchSetCollection(batch, collection);
  }

  for (let i = 0; i < collections.deleted.length; i++) {
    const collectionId = collections.deleted[i];
    batchDeleteCollection(batch, collectionId);
  }
};

const batchSetSubject = (batch: WriteBatch, subject: Subject) => {
  const docRef = getDocRef(CollectionKeys.SUBJECTS, subject.id);
  batch.set(docRef, subject);
};

const batchDeleteSubject = (batch: WriteBatch, subjectId: string) => {
  const docRef = getDocRef(CollectionKeys.SUBJECTS, subjectId);
  batch.delete(docRef);
};

export const batchWriteSubjects = (
  batch: WriteBatch,
  subjects: {
    deleted: string[];
    newAndUpdated: Subject[];
  }
) => {
  for (let i = 0; i < subjects.newAndUpdated.length; i++) {
    const subject = subjects.newAndUpdated[i];
    batchSetSubject(batch, subject);
  }

  for (let i = 0; i < subjects.deleted.length; i++) {
    const subjectId = subjects.deleted[i];
    batchDeleteSubject(batch, subjectId);
  }
};

const batchSetLanguage = (batch: WriteBatch, language: Language) => {
  const docRef = getDocRef(CollectionKeys.LANGUAGES, language.id);
  batch.set(docRef, language);
};

const batchDeleteLanguage = (batch: WriteBatch, languageId: string) => {
  const docRef = getDocRef(CollectionKeys.LANGUAGES, languageId);
  batch.delete(docRef);
};

export const batchWriteLanguages = (
  batch: WriteBatch,
  languages: {
    deleted: string[];
    newAndUpdated: Language[];
  }
) => {
  for (let i = 0; i < languages.newAndUpdated.length; i++) {
    const language = languages.newAndUpdated[i];
    batchSetLanguage(batch, language);
  }

  for (let i = 0; i < languages.deleted.length; i++) {
    const languageId = languages.deleted[i];
    batchDeleteLanguage(batch, languageId);
  }
};

const batchSetImage = (batch: WriteBatch, image: Image) => {
  const docRef = getDocRef(CollectionKeys.IMAGES, image.id);
  batch.set(docRef, image);
};

export const batchWriteImages = (batch: WriteBatch, images: Image[]) => {
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    batchSetImage(batch, image);
  }
};

const batchSetLandingSection = (
  batch: WriteBatch,
  landingSection: LandingSection
) => {
  const docRef = getDocRef(CollectionKeys.LANDING, landingSection.id);
  batch.set(docRef, landingSection);
};

const batchDeleteLandingSection = (
  batch: WriteBatch,
  landingSectionId: string
) => {
  const docRef = getDocRef(CollectionKeys.LANDING, landingSectionId);
  batch.delete(docRef);
};

export const batchWriteLanding = (
  batch: WriteBatch,
  landingSections: {
    deleted: string[];
    newAndUpdated: LandingSection[];
  }
) => {
  for (let i = 0; i < landingSections.newAndUpdated.length; i++) {
    const landingSection = landingSections.newAndUpdated[i];
    batchSetLandingSection(batch, landingSection);
  }

  for (let i = 0; i < landingSections.deleted.length; i++) {
    const landingSection = landingSections.deleted[i];
    batchDeleteLandingSection(batch, landingSection);
  }
};

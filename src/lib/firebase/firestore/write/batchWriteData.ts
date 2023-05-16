import { WriteBatch } from "firebase/firestore/lite";

import {
  removeUndefinedFromArticleLikeEntity,
  removeUndefinedFromAuthor,
  removeUndefinedFromCollection,
  removeUndefinedFromLanguage,
  removeUndefinedFromRecordedEvent,
  removeUndefinedFromRecordedEventType,
  removeUndefinedFromSubject,
  removeUndefinedFromTag,
} from "../_helpers/sanitise";
import { getDocRef } from "../getRefs";

import { Article } from "^types/article";
import { Author } from "^types/author";
import { Collection } from "^types/collection";
import { Image } from "^types/image";
import { Tag } from "^types/tag";
import { Language } from "^types/language";
import { LandingCustomSectionComponent } from "^types/landing";
import { Subject } from "^types/subject";
import { CollectionKey as CollectionKeys } from "../collectionKeys";
import { RecordedEvent } from "^types/recordedEvent";
import { RecordedEventType } from "^types/recordedEventType";
import { Blog } from "^types/blog";
import { AboutPage } from "^types/about";

export const batchSetArticle = (batch: WriteBatch, article: Article) => {
  const docRef = getDocRef(CollectionKeys.ARTICLES, article.id);
  const sanitised = removeUndefinedFromArticleLikeEntity(article);
  batch.set(docRef, sanitised);
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

export const batchSetBlog = (batch: WriteBatch, blog: Blog) => {
  const docRef = getDocRef(CollectionKeys.BLOGS, blog.id);
  const sanitised = removeUndefinedFromArticleLikeEntity(blog);
  batch.set(docRef, sanitised);
};

const batchDeleteBlog = (batch: WriteBatch, blogId: string) => {
  const docRef = getDocRef(CollectionKeys.BLOGS, blogId);
  batch.delete(docRef);
};

export const batchWriteBlogs = (
  batch: WriteBatch,
  blogs: {
    deleted: string[];
    newAndUpdated: Blog[];
  }
) => {
  for (let i = 0; i < blogs.newAndUpdated.length; i++) {
    const blog = blogs.newAndUpdated[i];
    batchSetBlog(batch, blog);
  }

  for (let i = 0; i < blogs.deleted.length; i++) {
    const blogId = blogs.deleted[i];
    batchDeleteBlog(batch, blogId);
  }
};

export const batchSetRecordedEvent = (
  batch: WriteBatch,
  recordedEvent: RecordedEvent
) => {
  const docRef = getDocRef(CollectionKeys.RECORDEDEVENTS, recordedEvent.id);
  const sanitised = removeUndefinedFromRecordedEvent(recordedEvent);
  batch.set(docRef, sanitised);
};

const batchDeleteRecordedEvent = (
  batch: WriteBatch,
  recordedEventId: string
) => {
  const docRef = getDocRef(CollectionKeys.RECORDEDEVENTS, recordedEventId);
  batch.delete(docRef);
};

export const batchWriteRecordedEvents = (
  batch: WriteBatch,
  recordedEvents: {
    deleted: string[];
    newAndUpdated: RecordedEvent[];
  }
) => {
  for (let i = 0; i < recordedEvents.newAndUpdated.length; i++) {
    const recordedEvent = recordedEvents.newAndUpdated[i];
    batchSetRecordedEvent(batch, recordedEvent);
  }

  for (let i = 0; i < recordedEvents.deleted.length; i++) {
    const recordedEventId = recordedEvents.deleted[i];
    batchDeleteRecordedEvent(batch, recordedEventId);
  }
};

const batchSetAuthor = (batch: WriteBatch, author: Author) => {
  const docRef = getDocRef(CollectionKeys.AUTHORS, author.id);
  const sanitised = removeUndefinedFromAuthor(author);
  batch.set(docRef, sanitised);
};
export const batchSetAuthors = (batch: WriteBatch, authors: Author[]) => {
  for (let i = 0; i < authors.length; i++) {
    const author = authors[i];
    batchSetAuthor(batch, author);
  }
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
  const sanitised = removeUndefinedFromTag(tag);
  batch.set(docRef, sanitised);
};
export const batchSetTags = (batch: WriteBatch, tags: Tag[]) => {
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    batchSetTag(batch, tag);
  }
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

export const batchSetCollection = (
  batch: WriteBatch,
  collection: Collection
) => {
  const docRef = getDocRef(CollectionKeys.COLLECTIONS, collection.id);
  const sanitised = removeUndefinedFromCollection(collection);
  batch.set(docRef, sanitised);
};
export const batchSetCollections = (
  batch: WriteBatch,
  collections: Collection[]
) => {
  for (let i = 0; i < collections.length; i++) {
    const collection = collections[i];
    batchSetCollection(batch, collection);
  }
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

const batchSetRecordedEventType = (
  batch: WriteBatch,
  recordedEventType: RecordedEventType
) => {
  const docRef = getDocRef(
    CollectionKeys.RECORDEDEVENTTYPES,
    recordedEventType.id
  );
  const sanitised = removeUndefinedFromRecordedEventType(recordedEventType);
  batch.set(docRef, sanitised);
};

const batchDeleteRecordedEventType = (
  batch: WriteBatch,
  recordedEventTypeId: string
) => {
  const docRef = getDocRef(
    CollectionKeys.RECORDEDEVENTTYPES,
    recordedEventTypeId
  );
  batch.delete(docRef);
};

export const batchWriteRecordedEventTypes = (
  batch: WriteBatch,
  recordedEventTypes: {
    deleted: string[];
    newAndUpdated: RecordedEventType[];
  }
) => {
  for (let i = 0; i < recordedEventTypes.newAndUpdated.length; i++) {
    const recordedEventType = recordedEventTypes.newAndUpdated[i];
    batchSetRecordedEventType(batch, recordedEventType);
  }

  for (let i = 0; i < recordedEventTypes.deleted.length; i++) {
    const recordedEventTypeId = recordedEventTypes.deleted[i];
    batchDeleteRecordedEventType(batch, recordedEventTypeId);
  }
};

export const batchSetSubject = (batch: WriteBatch, subject: Subject) => {
  const docRef = getDocRef(CollectionKeys.SUBJECTS, subject.id);
  const sanitised = removeUndefinedFromSubject(subject);
  batch.set(docRef, sanitised);
};
export const batchSetSubjects = (batch: WriteBatch, subjects: Subject[]) => {
  for (let i = 0; i < subjects.length; i++) {
    const subject = subjects[i];
    batchSetSubject(batch, subject);
  }
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
  const sanitised = removeUndefinedFromLanguage(language);
  batch.set(docRef, sanitised);
};
export const batchSetLanguages = (batch: WriteBatch, languages: Language[]) => {
  for (let i = 0; i < languages.length; i++) {
    const language = languages[i];
    batchSetLanguage(batch, language);
  }
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

export const batchSetImages = (batch: WriteBatch, images: Image[]) => {
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    batchSetImage(batch, image);
  }
};

const batchSetLandingComponent = (
  batch: WriteBatch,
  landingSection: LandingCustomSectionComponent
) => {
  const docRef = getDocRef(CollectionKeys.LANDING, landingSection.id);
  batch.set(docRef, landingSection);
};

const batchDeleteLandingComponent = (
  batch: WriteBatch,
  landingSectionId: string
) => {
  const docRef = getDocRef(CollectionKeys.LANDING, landingSectionId);
  batch.delete(docRef);
};

export const batchWriteLandingComponents = (
  batch: WriteBatch,
  landingComponents: {
    deleted: string[];
    newAndUpdated: LandingCustomSectionComponent[];
  }
) => {
  for (let i = 0; i < landingComponents.newAndUpdated.length; i++) {
    const landingComponent = landingComponents.newAndUpdated[i];
    batchSetLandingComponent(batch, landingComponent);
  }

  for (let i = 0; i < landingComponents.deleted.length; i++) {
    const landingComponent = landingComponents.deleted[i];
    batchDeleteLandingComponent(batch, landingComponent);
  }
};

export const batchSetAboutPage = (batch: WriteBatch, aboutPage: AboutPage) => {
  console.log("aboutPage:", aboutPage);
  const docRef = getDocRef(CollectionKeys.ABOUT, aboutPage.id);
  console.log("docRef:", docRef);
  batch.set(docRef, aboutPage);
};

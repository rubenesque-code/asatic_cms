import { setDoc } from "firebase/firestore/lite";

import {
  removeUndefinedFromArticleLikeEntity,
  removeUndefinedFromCollection,
  removeUndefinedFromRecordedEvent,
  removeUndefinedFromSubject,
  removeUndefinedFromAuthor,
  removeUndefinedFromTag,
} from "../_helpers/sanitise";
import { CollectionKey as CollectionKey } from "../collectionKeys";
import { getDocRef } from "../getRefs";

import {
  Article,
  Author,
  Blog,
  Collection,
  Image,
  RecordedEvent,
  Subject,
  Tag,
} from "^types/index";

export const writeArticle = async (article: Article) => {
  const docRef = getDocRef(CollectionKey.ARTICLES, article.id);
  const sanitised = removeUndefinedFromArticleLikeEntity(article);
  await setDoc(docRef, sanitised);
};

export const writeBlog = async (blog: Blog) => {
  const docRef = getDocRef(CollectionKey.BLOGS, blog.id);
  const sanitised = removeUndefinedFromArticleLikeEntity(blog);
  await setDoc(docRef, sanitised);
};

export const writeCollection = async (collection: Collection) => {
  const docRef = getDocRef(CollectionKey.COLLECTIONS, collection.id);
  const sanitised = removeUndefinedFromCollection(collection);
  await setDoc(docRef, sanitised);
};

export const writeRecordedEvent = async (recordedEvent: RecordedEvent) => {
  const docRef = getDocRef(CollectionKey.RECORDEDEVENTS, recordedEvent.id);
  const sanitised = removeUndefinedFromRecordedEvent(recordedEvent);
  await setDoc(docRef, sanitised);
};

export const writeSubject = async (subject: Subject) => {
  const docRef = getDocRef(CollectionKey.SUBJECTS, subject.id);
  const sanitised = removeUndefinedFromSubject(subject);
  await setDoc(docRef, sanitised);
};

export const writeImage = async (image: Image) => {
  const docRef = getDocRef(CollectionKey.IMAGES, image.id);
  await setDoc(docRef, image);
};

export const writeAuthor = async (author: Author) => {
  const docRef = getDocRef(CollectionKey.AUTHORS, author.id);
  const sanitised = removeUndefinedFromAuthor(author);
  await setDoc(docRef, sanitised);
};

export const writeTag = async (tag: Tag) => {
  const docRef = getDocRef(CollectionKey.TAGS, tag.id);
  const sanitised = removeUndefinedFromTag(tag);
  await setDoc(docRef, sanitised);
};

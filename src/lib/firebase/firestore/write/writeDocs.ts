import { deleteDoc, setDoc } from "firebase/firestore/lite";

import {
  removeUndefinedFromArticleLikeEntity,
  removeUndefinedFromCollection,
  removeUndefinedFromRecordedEvent,
  removeUndefinedFromSubject,
} from "../_helpers/sanitise";
import { Collection as CollectionKey } from "../collectionKeys";
import { getDocRef } from "../getRefs";

import {
  Article,
  Blog,
  Collection,
  Image,
  RecordedEvent,
  Subject,
} from "^types/index";

export const writeArticle = async (article: Article) => {
  const docRef = getDocRef(CollectionKey.ARTICLES, article.id);
  const sanitised = removeUndefinedFromArticleLikeEntity(article);
  await setDoc(docRef, sanitised);
};

export const deleteArticle = async (id: string) => {
  const docRef = getDocRef(CollectionKey.ARTICLES, id);
  await deleteDoc(docRef);
};

export const writeBlog = async (blog: Blog) => {
  const docRef = getDocRef(CollectionKey.BLOGS, blog.id);
  const sanitised = removeUndefinedFromArticleLikeEntity(blog);
  await setDoc(docRef, sanitised);
};

export const deleteBlog = async (id: string) => {
  const docRef = getDocRef(CollectionKey.BLOGS, id);
  await deleteDoc(docRef);
};

export const writeCollection = async (collection: Collection) => {
  const docRef = getDocRef(CollectionKey.COLLECTIONS, collection.id);
  const sanitised = removeUndefinedFromCollection(collection);
  await setDoc(docRef, sanitised);
};

export const deleteCollection = async (id: string) => {
  const docRef = getDocRef(CollectionKey.COLLECTIONS, id);
  await deleteDoc(docRef);
};

export const writeRecordedEvent = async (recordedEvent: RecordedEvent) => {
  const docRef = getDocRef(CollectionKey.RECORDEDEVENTS, recordedEvent.id);
  const sanitised = removeUndefinedFromRecordedEvent(recordedEvent);
  await setDoc(docRef, sanitised);
};

export const deleteRecordedEvent = async (id: string) => {
  const docRef = getDocRef(CollectionKey.RECORDEDEVENTS, id);
  await deleteDoc(docRef);
};

export const writeSubject = async (subject: Subject) => {
  const docRef = getDocRef(CollectionKey.SUBJECTS, subject.id);
  const sanitised = removeUndefinedFromSubject(subject);
  await setDoc(docRef, sanitised);
};

export const deleteSubject = async (id: string) => {
  const docRef = getDocRef(CollectionKey.SUBJECTS, id);
  await deleteDoc(docRef);
};

export const writeImage = async (image: Image) => {
  const docRef = getDocRef(CollectionKey.IMAGES, image.id);
  await setDoc(docRef, image);
};

export const deleteImage = async (id: string) => {
  const docRef = getDocRef(CollectionKey.IMAGES, id);
  await deleteDoc(docRef);
};

import { deleteDoc, setDoc } from "firebase/firestore/lite";
import { Article } from "^types/article";
import { Blog } from "^types/blog";
import { Collection } from "^types/collection";
import { Image } from "^types/image";
import { RecordedEvent } from "^types/recordedEvent";
import { Collection as CollectionKey } from "../collectionKeys";
import { getDocRef } from "../getRefs";

export const writeArticle = async (article: Article) => {
  const docRef = getDocRef(CollectionKey.ARTICLES, article.id);
  await setDoc(docRef, article);
};

export const deleteArticle = async (id: string) => {
  const docRef = getDocRef(CollectionKey.ARTICLES, id);
  await deleteDoc(docRef);
};

export const writeBlog = async (blog: Blog) => {
  const docRef = getDocRef(CollectionKey.BLOGS, blog.id);
  await setDoc(docRef, blog);
};

export const deleteBlog = async (id: string) => {
  const docRef = getDocRef(CollectionKey.BLOGS, id);
  await deleteDoc(docRef);
};

export const writeCollection = async (collection: Collection) => {
  const docRef = getDocRef(CollectionKey.COLLECTIONS, collection.id);
  await setDoc(docRef, collection);
};

export const deleteCollection = async (id: string) => {
  const docRef = getDocRef(CollectionKey.COLLECTIONS, id);
  await deleteDoc(docRef);
};

export const writeRecordedEvent = async (recordedEvent: RecordedEvent) => {
  const docRef = getDocRef(CollectionKey.RECORDEDEVENTS, recordedEvent.id);
  await setDoc(docRef, recordedEvent);
};

export const deleteRecordedEvent = async (id: string) => {
  const docRef = getDocRef(CollectionKey.RECORDEDEVENTS, id);
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

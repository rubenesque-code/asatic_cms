import { deleteDoc, setDoc } from "firebase/firestore/lite";
import { Article } from "^types/article";
import { Image } from "^types/image";
import { Collection } from "../collectionKeys";
import { getDocRef } from "../getRefs";

export const writeArticle = async (article: Article) => {
  const docRef = getDocRef(Collection.ARTICLES, article.id);
  await setDoc(docRef, article);
};

export const deleteArticle = async (id: string) => {
  const docRef = getDocRef(Collection.ARTICLES, id);
  await deleteDoc(docRef);
};

export const writeImage = async (image: Image) => {
  const docRef = getDocRef(Collection.IMAGES, image.id);
  await setDoc(docRef, image);
};

export const deleteImage = async (id: string) => {
  const docRef = getDocRef(Collection.IMAGES, id);
  await deleteDoc(docRef);
};

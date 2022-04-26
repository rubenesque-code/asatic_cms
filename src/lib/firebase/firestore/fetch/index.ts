import {
  getDoc,
  collection,
  getDocs,
  doc,
  DocumentData,
} from "@firebase/firestore/lite";

import { firestore } from "../../init";
import { COLLECTIONS } from "../collectionAndDocNames";

export const fetchArticle = async (id: string) => {
  const docRef = doc(firestore, COLLECTIONS.ARTICLES, id);
  const docSnap = await getDoc(docRef);
  const docData = docSnap.data();

  return docData;
};

export const fetchArticles = async () => {
  const collectionRef = collection(firestore, COLLECTIONS.ARTICLES);
  const docsSnap = await getDocs(collectionRef);
  const data: DocumentData[] = [];
  docsSnap.forEach((doc) => {
    const d = doc.data();
    data.push(d);
  });

  return data;
};

export const fetchTags = async () => {
  const collectionRef = collection(firestore, COLLECTIONS.TAGS);
  const docsSnap = await getDocs(collectionRef);
  const data: DocumentData[] = [];
  docsSnap.forEach((doc) => {
    const d = doc.data();
    data.push(d);
  });

  return data;
};

export const fetchLanguages = async () => {
  const collectionRef = collection(firestore, COLLECTIONS.LANGUAGES);
  const docsSnap = await getDocs(collectionRef);
  const data: DocumentData[] = [];
  docsSnap.forEach((doc) => {
    const d = doc.data();
    data.push(d);
  });

  return data;
};

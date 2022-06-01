import { doc, getDoc, getDocs, DocumentData } from "@firebase/firestore/lite";
import { firestore } from "^lib/firebase/init";

import { CollectionKey, COLLECTIONS } from "../collectionAndDocNames";
import { getCollectionRef } from "../getRefs";

const fetchCollection = async (collectionKey: CollectionKey) => {
  const collectionRef = getCollectionRef(collectionKey);
  const docsSnap = await getDocs(collectionRef);
  const data: DocumentData[] = [];
  docsSnap.forEach((doc) => {
    const d = doc.data();
    data.push(d);
  });

  return data;
};

export const fetchArticles = () => fetchCollection("ARTICLES");

export const fetchAuthors = () => fetchCollection("AUTHORS");

export const fetchLanguages = () => fetchCollection("LANGUAGES");

export const fetchTags = () => fetchCollection("TAGS");

export const fetchImages = () => fetchCollection("IMAGES");

// * is used?
export const fetchImage = async (id: string) => {
  const docRef = doc(firestore, COLLECTIONS.IMAGES, id);
  const docSnap = await getDoc(docRef);

  const docData = docSnap.data();

  return docData;
};

export const fetchVideos = () => fetchCollection("VIDEOS");

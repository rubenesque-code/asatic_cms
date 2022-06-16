import { getDocs, DocumentData } from "@firebase/firestore/lite";

import { Collection } from "../collectionKeys";
import { getCollectionRef } from "../getRefs";

const fetchCollection = async (collectionKey: Collection) => {
  const collectionRef = getCollectionRef(collectionKey);
  const docsSnap = await getDocs(collectionRef);
  const data: DocumentData[] = [];
  docsSnap.forEach((doc) => {
    const d = doc.data();
    data.push(d);
  });

  return data;
};

export const fetchArticles = () => fetchCollection(Collection.ARTICLES);

export const fetchAuthors = () => fetchCollection(Collection.AUTHORS);

export const fetchLanguages = () => fetchCollection(Collection.LANGUAGES);

export const fetchTags = () => fetchCollection(Collection.TAGS);

export const fetchImages = () => fetchCollection(Collection.IMAGES);

export const fetchImageKeywords = () =>
  fetchCollection(Collection.IMAGEKEYWORDS);

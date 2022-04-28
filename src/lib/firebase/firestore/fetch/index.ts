import { getDocs, DocumentData } from "@firebase/firestore/lite";

import { CollectionKey } from "../collectionAndDocNames";
import { getCollectionRef } from "../getRefs";

/**
  export const fetchArticle = async (id: string) => {
    const docRef = doc(firestore, COLLECTIONS.ARTICLES, id);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();
  
    return docData;
  };
*/

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

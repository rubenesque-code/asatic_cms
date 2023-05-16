import { getDocs, DocumentData } from "@firebase/firestore/lite";

import { CollectionKey } from "../collectionKeys";
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

export const fetchArticles = () => fetchCollection(CollectionKey.ARTICLES);

export const fetchAuthors = () => fetchCollection(CollectionKey.AUTHORS);

export const fetchBlogs = () => fetchCollection(CollectionKey.BLOGS);

export const fetchCollections = () =>
  fetchCollection(CollectionKey.COLLECTIONS);

export const fetchLanguages = () => fetchCollection(CollectionKey.LANGUAGES);

export const fetchTags = () => fetchCollection(CollectionKey.TAGS);

export const fetchImages = () => fetchCollection(CollectionKey.IMAGES);

export const fetchLanding = () => fetchCollection(CollectionKey.LANDING);

export const fetchAbout = () => fetchCollection(CollectionKey.ABOUT);

export const fetchRecordedEvents = () =>
  fetchCollection(CollectionKey.RECORDEDEVENTS);

export const fetchRecordedEventTypes = () =>
  fetchCollection(CollectionKey.RECORDEDEVENTTYPES);

export const fetchSubjects = () => fetchCollection(CollectionKey.SUBJECTS);

import { collection, doc } from "@firebase/firestore/lite";

import { firestore } from "../init";
import { CollectionKey, COLLECTIONS } from "./collectionAndDocNames";

export const getCollectionRef = (collectionKey: CollectionKey) =>
  collection(firestore, COLLECTIONS[collectionKey]);

export const getDocRef = (collectionKey: CollectionKey, docId: string) =>
  doc(firestore, COLLECTIONS[collectionKey], docId);

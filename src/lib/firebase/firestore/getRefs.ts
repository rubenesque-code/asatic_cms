import { collection, doc } from "@firebase/firestore/lite";

import { firestore } from "../init";
import { CollectionKey } from "./collectionKeys";

export const getCollectionRef = (collectionKey: CollectionKey) =>
  collection(firestore, collectionKey);

export const getDocRef = (collectionKey: CollectionKey, docId: string) =>
  doc(firestore, collectionKey, docId);

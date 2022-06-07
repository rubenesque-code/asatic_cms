import { collection, doc } from "@firebase/firestore/lite";

import { firestore } from "../init";
import { Collection } from "./collectionKeys";

export const getCollectionRef = (collectionKey: Collection) =>
  collection(firestore, collectionKey);

export const getDocRef = (collectionKey: Collection, docId: string) =>
  doc(firestore, collectionKey, docId);

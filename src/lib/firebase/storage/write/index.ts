import {
  getDownloadURL,
  uploadBytes,
  ref as createRef,
} from "@firebase/storage";
import { v4 as generateUId } from "uuid";

import { storage } from "^lib/firebase/init";

import { FOLDERS } from "../folders";

export const uploadImage = async (file: File) => {
  const id = generateUId();
  const ref = createRef(storage, `${FOLDERS.IMAGES}/${id}`);

  await uploadBytes(ref, file);

  const URL = await getDownloadURL(ref);

  return URL;
};

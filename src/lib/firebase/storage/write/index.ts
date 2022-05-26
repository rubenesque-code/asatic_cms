import {
  getDownloadURL,
  uploadBytes,
  ref as createRef,
} from "@firebase/storage";
import { v4 as generateUId } from "uuid";
import { wait } from "^helpers/async";
// import { poll } from "^helpers/async";

import { storage } from "^lib/firebase/init";
import { checkIsImage } from "../fetch";

import { FOLDERS } from "../folders";

const poll = async (id: string, getURL: () => Promise<string>) => {
  let imageIsCreated = await checkIsImage(id);
  let url: string | undefined;
  while (!url) {
    await wait();
    imageIsCreated = await checkIsImage(id);
    if (imageIsCreated) {
      url = await getURL();
    }
  }

  return url;
};

export const uploadImage = async (file: File) => {
  const unresizedId = generateUId();
  const unresizedRef = createRef(storage, `${FOLDERS.IMAGES}/${unresizedId}`);

  await uploadBytes(unresizedRef, file);

  const URLId = unresizedId + "_2400x1600";
  const URLref = createRef(storage, `${FOLDERS.IMAGES}/${URLId}`);
  const getURL = async () => await getDownloadURL(URLref);
  const URL = await poll(URLId, getURL);

  const blurURLId = unresizedId + "_32x32";
  const blurURLref = createRef(storage, `${FOLDERS.IMAGES}/${blurURLId}`);
  const getBlurURL = async () => await getDownloadURL(blurURLref);
  const blurURL = await poll(blurURLId, getBlurURL);

  return { URL, URLstorageId: URLId, blurURL, blurURLstorageId: blurURLId };
};

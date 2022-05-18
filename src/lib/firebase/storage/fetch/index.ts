import { getDownloadURL, listAll, ref } from "firebase/storage";
import { v4 as generateUId } from "uuid";
import { storage } from "^lib/firebase/init";
import { FOLDERS } from "../folders";

export const fetchImages = async () => {
  const listRef = ref(storage, FOLDERS.IMAGES);
  const imageRefs = (await listAll(listRef)).items;
  const URLs = await Promise.all(
    imageRefs.map(async (imageRef) => {
      const URL = await getDownloadURL(imageRef);
      return URL;
    })
  );
  const data = URLs.map((URL) => ({ id: generateUId(), URL }));

  return data;
};

import { getDownloadURL, listAll, ref } from "firebase/storage";
import { v4 as generateUId } from "uuid";
import { storage } from "^lib/firebase/init";
import { FOLDERS } from "../folders";

// todo: this isn't used?
export const fetchImages = async () => {
  const listRef = ref(storage, FOLDERS.IMAGES);
  const imageRefs = (await listAll(listRef)).items;

  const downloadPromises = imageRefs.map(async (imageRef) => {
    const URL = await getDownloadURL(imageRef);
    return URL;
  });
  const URLs = await Promise.all(downloadPromises);

  const data = URLs.map((URL) => ({ id: generateUId(), URL }));

  return data;
};

export const checkIsImage = async (id: string) => {
  const listRef = ref(storage, FOLDERS.IMAGES);
  const imageRefs = (await listAll(listRef)).items;
  const imageIds = imageRefs.map((ref) => ref.name);

  const isImage = imageIds.includes(id);

  return isImage;
};

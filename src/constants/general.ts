import { FOLDERS as STORAGE_FOLDERS } from "^lib/firebase/storage/folders";

export const __DEV_MODE__ = process.env.NODE_ENV === "development";

export const STORAGE_DOMAIN = __DEV_MODE__
  ? "http://localhost:9199/"
  : "https://firebasestorage.googleapis.com/";

export const IMAGE_URL_BASE =
  STORAGE_DOMAIN +
  "v0/b/" +
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET +
  "/o/" +
  STORAGE_FOLDERS.IMAGES +
  "%";

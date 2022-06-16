import { Collection } from "^lib/firebase/firestore/collectionKeys";
import { useFetchArticlesQuery } from "../articles";
import { useFetchAuthorsQuery } from "../authors";
import { useFetchImageKeywordsQuery } from "../imageKeywords";
import { useFetchImagesQuery } from "../images";
import { useFetchLanguagesQuery } from "../languages";
import { useFetchTagsQuery } from "../tags";

export const serviceFetchHooksMapping = {
  [Collection.ARTICLES]: useFetchArticlesQuery,
  [Collection.AUTHORS]: useFetchAuthorsQuery,
  [Collection.IMAGES]: useFetchImagesQuery,
  [Collection.IMAGEKEYWORDS]: useFetchImageKeywordsQuery,
  [Collection.LANGUAGES]: useFetchLanguagesQuery,
  [Collection.TAGS]: useFetchTagsQuery,
};

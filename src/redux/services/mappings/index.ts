import { Collection } from "^lib/firebase/firestore/collectionKeys";
import { useFetchArticlesQuery } from "../articles";
import { useFetchAuthorsQuery } from "../authors";
import { useFetchImagesQuery } from "../images";
import { useFetchLandingQuery } from "../landing";
import { useFetchLanguagesQuery } from "../languages";
import { useFetchTagsQuery } from "../tags";

export const serviceFetchHooksMapping = {
  [Collection.ARTICLES]: useFetchArticlesQuery,
  [Collection.AUTHORS]: useFetchAuthorsQuery,
  [Collection.IMAGES]: useFetchImagesQuery,
  [Collection.LANGUAGES]: useFetchLanguagesQuery,
  [Collection.TAGS]: useFetchTagsQuery,
  [Collection.LANDING]: useFetchLandingQuery,
};

import { useFetchArticlesQuery } from "../articles";
import { useFetchAuthorsQuery } from "../authors";
import { useFetchImagesQuery } from "../images";
import { useFetchLanguagesQuery } from "../languages";
import { useFetchTagsQuery } from "../tags";

export const serviceFetchHooksMapping = {
  articles: useFetchArticlesQuery,
  authors: useFetchAuthorsQuery,
  images: useFetchImagesQuery,
  languages: useFetchLanguagesQuery,
  tags: useFetchTagsQuery,
};

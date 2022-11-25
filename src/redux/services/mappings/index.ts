import { CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import { useFetchArticlesQuery } from "../articles";
import { useFetchAuthorsQuery } from "../authors";
import { useFetchBlogsQuery } from "../blogs";
import { useFetchCollectionsQuery } from "../collections";
import { useFetchImagesQuery } from "../images";
import { useFetchLandingQuery } from "../landing";
import { useFetchLanguagesQuery } from "../languages";
import { useFetchRecordedEventsQuery } from "../recordedEvents";
import { useFetchRecordedEventTypesQuery } from "../recordedEventTypes";
import { useFetchSubjectsQuery } from "../subjects";
import { useFetchTagsQuery } from "../tags";

export const serviceFetchHooksMapping = {
  [CollectionKey.ARTICLES]: useFetchArticlesQuery,
  [CollectionKey.AUTHORS]: useFetchAuthorsQuery,
  [CollectionKey.BLOGS]: useFetchBlogsQuery,
  [CollectionKey.COLLECTIONS]: useFetchCollectionsQuery,
  [CollectionKey.IMAGES]: useFetchImagesQuery,
  [CollectionKey.LANGUAGES]: useFetchLanguagesQuery,
  [CollectionKey.LANDING]: useFetchLandingQuery,
  [CollectionKey.RECORDEDEVENTS]: useFetchRecordedEventsQuery,
  [CollectionKey.RECORDEDEVENTTYPES]: useFetchRecordedEventTypesQuery,
  [CollectionKey.SUBJECTS]: useFetchSubjectsQuery,
  [CollectionKey.TAGS]: useFetchTagsQuery,
};

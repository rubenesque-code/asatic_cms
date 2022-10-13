import { Collection } from "^lib/firebase/firestore/collectionKeys";

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
  [Collection.ARTICLES]: useFetchArticlesQuery,
  [Collection.AUTHORS]: useFetchAuthorsQuery,
  [Collection.BLOGS]: useFetchBlogsQuery,
  [Collection.COLLECTIONS]: useFetchCollectionsQuery,
  [Collection.IMAGES]: useFetchImagesQuery,
  [Collection.LANGUAGES]: useFetchLanguagesQuery,
  [Collection.LANDING]: useFetchLandingQuery,
  [Collection.RECORDEDEVENTS]: useFetchRecordedEventsQuery,
  [Collection.RECORDEDEVENTTYPES]: useFetchRecordedEventTypesQuery,
  [Collection.SUBJECTS]: useFetchSubjectsQuery,
  [Collection.TAGS]: useFetchTagsQuery,
};

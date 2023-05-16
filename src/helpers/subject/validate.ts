import { checkEntityIsValidAsSummary as checkArticleLikeEntityIsValidAsSummary } from "../article-like";
import { checkEntityIsValidAsSummary as checkRecordedEventIsValidAsSummary } from "../recorded-event";

import {
  Article,
  Blog,
  Collection,
  RecordedEvent,
  Subject,
} from "^types/index";
import { checkCollectionIsValidAsSummary } from "../collection";

// todo: this requirement has changed!?

export function checkRelatedSubjectIsValid(subject: Subject) {
  if (subject.publishStatus !== "published") {
    return false;
  }
  if (!subject.title) {
    return false;
  }
  return true;
}

export function checkHasValidRelatedPrimaryEntity({
  articleLikeEntities,
  collections,
  recordedEvents,
  allLanguageIds,
}: {
  articleLikeEntities: (Article | Blog)[];
  collections: Collection[];
  recordedEvents: RecordedEvent[];
  allLanguageIds: string[];
}) {
  const validArticleLikeEntity = articleLikeEntities.find((entity) =>
    checkArticleLikeEntityIsValidAsSummary(entity, allLanguageIds)
  );

  const validRecordedEvent = recordedEvents.find((entity) =>
    checkRecordedEventIsValidAsSummary(entity, allLanguageIds)
  );

  const validCollection = collections.find((collection) =>
    checkCollectionIsValidAsSummary({
      allLanguageIds,
      articleLikeEntities,
      collection,
      recordedEvents,
    })
  );

  return Boolean(
    validArticleLikeEntity || validRecordedEvent || validCollection
  );
}

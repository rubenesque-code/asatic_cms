import { mapIds } from "^helpers/general";
import { useSelector } from "^redux/hooks";
import { selectEntitiesByIds as selectAuthorsByIds } from "^redux/state/authors";
import { selectEntitiesByIds as selectLanguagesByIds } from "^redux/state/languages";
import { selectEntitiesByIds as selectSubjectsByIds } from "^redux/state/subjects";
import { selectEntitiesByIds as selectTagsByIds } from "^redux/state/tags";
import {
  RecordedEvent,
  RecordedEventError,
  RecordedEventStatus,
} from "^types/recordedEvent";

// todo: missing image that was referenced; same for summary image

const useRecordedEventStatus = (
  recordedEvent: RecordedEvent
): RecordedEventStatus => {
  const { authorIds, lastSave, publishInfo, subjectIds, tagIds, translations } =
    recordedEvent;
  const languageIds = translations.map((t) => t.languageId);

  const languages = useSelector((state) =>
    selectLanguagesByIds(state, languageIds)
  );
  const validLanguages = languages.flatMap((l) => (l ? [l] : []));
  const validLanguagesById = mapIds(validLanguages);

  const authors = useSelector((state) => selectAuthorsByIds(state, authorIds));
  const subjects = useSelector((state) =>
    selectSubjectsByIds(state, subjectIds)
  );
  const tags = useSelector((state) => selectTagsByIds(state, tagIds));

  const isNew = !lastSave;
  if (isNew) {
    return "new";
  }

  const isDraft = publishInfo.status === "draft";
  if (isDraft) {
    return "draft";
  }

  // INVALID CHECK
  const hasTranslationWithRequiredFields = translations.find((t) => {
    const languageIsValid = validLanguagesById.includes(t.languageId);
    const hasTitle = t.title;

    if (languageIsValid && hasTitle) {
      return true;
    }
    return false;
  });

  if (!hasTranslationWithRequiredFields) {
    return "invalid";
  }

  const errors: RecordedEventError[] = [];

  // LANGUAGE ERRORS
  const isMissingLanguage = languages.includes(undefined);
  if (isMissingLanguage) {
    errors.push("missing language");
  }

  // AUTHOR ERRORS
  const isMissingAuthor = authors.includes(undefined);
  if (isMissingAuthor) {
    errors.push("missing author");
  }

  let isMissingAuthorTranslation = false;

  const validAuthors = authors.flatMap((a) => (a ? [a] : []));
  const validAuthorsById = mapIds(validAuthors);

  for (let i = 0; i < validLanguagesById.length; i++) {
    const languageId = validLanguagesById[i];
    const isTranslationForLanguage = validAuthorsById.includes(languageId);
    if (!isTranslationForLanguage) {
      isMissingAuthorTranslation = true;
    }
  }

  if (isMissingAuthorTranslation) {
    errors.push("missing author translation");
  }

  // SUBJECT ERRORS
  const isMissingSubject = subjects.includes(undefined);
  if (isMissingSubject) {
    errors.push("missing subject");
  }

  let isMissingSubjectTranslation = false;

  const validSubjects = subjects.flatMap((a) => (a ? [a] : []));
  const validSubjectsById = mapIds(validSubjects);

  for (let i = 0; i < validLanguagesById.length; i++) {
    const languageId = validLanguagesById[i];
    const isTranslationForLanguage = validSubjectsById.includes(languageId);
    if (!isTranslationForLanguage) {
      isMissingSubjectTranslation = true;
    }
  }

  if (isMissingSubjectTranslation) {
    errors.push("missing subject translation");
  }

  // TAG ERRORS
  const isMissingTag = tags.includes(undefined);
  if (isMissingTag) {
    errors.push("missing tag");
  }

  return errors.length ? { status: "error", errors } : "good";
};

export default useRecordedEventStatus;

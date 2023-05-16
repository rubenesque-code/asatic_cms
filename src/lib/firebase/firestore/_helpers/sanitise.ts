import produce from "immer";

import {
  Article,
  Author,
  Blog,
  Collection,
  Language,
  RecordedEvent,
  RecordedEventType,
  Subject,
  Tag,
} from "^types/index";

export function removeUndefinedFromArticleLikeEntity<
  TEntity extends Article | Blog
>(entity: TEntity) {
  return produce(entity, (draft) => {
    draft.translations.forEach((_translation, i) => {
      if (draft.translations[i].title === undefined) {
        delete draft.translations[i].title;
      }
      if (draft.translations[i].summary === undefined) {
        delete draft.translations[i].summary;
      }
    });
  });
}

export function removeUndefinedFromRecordedEvent(entity: RecordedEvent) {
  return produce(entity, (draft) => {
    draft.translations.forEach((_translation, i) => {
      if (draft.translations[i].title === undefined) {
        delete draft.translations[i].title;
      }

      if (draft.translations[i].body === undefined) {
        delete draft.translations[i].body;
      }
    });

    if (draft.youtubeId === undefined) {
      delete draft.youtubeId;
    }
    if (draft.recordedEventTypeId === undefined) {
      delete draft.recordedEventTypeId;
    }
  });
}

export function removeUndefinedFromAuthor(entity: Author) {
  return produce(entity, (draft) => {
    draft.translations.forEach((_translation, i) => {
      if (draft.translations[i].name === undefined) {
        delete draft.translations[i].name;
      }
    });
  });
}

export function removeUndefinedFromCollection(entity: Collection) {
  return produce(entity, (draft) => {
    if (draft.description === undefined) {
      delete draft.description;
    }
    if (draft.summary === undefined) {
      delete draft.summary;
    }
  });
}

export function removeUndefinedFromRecordedEventType(
  entity: RecordedEventType
) {
  return produce(entity, (draft) => {
    draft.translations.forEach((_translation, i) => {
      if (draft.translations[i].name === undefined) {
        delete draft.translations[i].name;
      }
    });
  });
}

export function removeUndefinedFromSubject(entity: Subject) {
  return produce(entity, (draft) => {
    if (draft.title === undefined) {
      delete draft.title;
    }
  });
}

export function removeUndefinedFromTag(entity: Tag) {
  return produce(entity, (draft) => {
    if (draft.text === undefined) {
      delete draft.text;
    }
  });
}

export function removeUndefinedFromLanguage(entity: Language) {
  return produce(entity, (draft) => {
    if (draft.name === undefined) {
      delete draft.name;
    }
  });
}

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
    for (const [key, value] of Object.entries(
      draft.landingCustomSectionImage
    )) {
      type Key = keyof typeof draft.landingCustomSectionImage;
      if (value === undefined) {
        delete draft.landingCustomSectionImage[key as Key];
      }
    }

    for (const [key, value] of Object.entries(draft.summaryImage)) {
      type Key = keyof typeof draft.summaryImage;
      if (value === undefined) {
        delete draft.summaryImage[key as Key];
      }
    }

    draft.translations.forEach((_translation, i) => {
      if (draft.translations[i].title === undefined) {
        delete draft.translations[i].title;
      }
      for (const [key, value] of Object.entries(
        draft.translations[i].summary
      )) {
        type Key = keyof typeof draft.translations[number]["summary"];
        if (value === undefined) {
          delete draft.translations[i]["summary"][key as Key];
        }
      }
    });

    if (draft.publishDate === undefined) {
      delete draft.publishDate;
    }
  });
}

export function removeUndefinedFromRecordedEvent(entity: RecordedEvent) {
  return produce(entity, (draft) => {
    for (const [key, value] of Object.entries(
      draft.landingCustomSectionImage
    )) {
      type Key = keyof typeof draft.landingCustomSectionImage;
      if (value === undefined) {
        delete draft.landingCustomSectionImage[key as Key];
      }
    }

    for (const [key, value] of Object.entries(draft.summaryImage)) {
      type Key = keyof typeof draft.summaryImage;
      if (value === undefined) {
        delete draft.summaryImage[key as Key];
      }
    }

    draft.translations.forEach((_translation, i) => {
      if (draft.translations[i].title === undefined) {
        delete draft.translations[i].title;
      }

      if (draft.translations[i].body === undefined) {
        delete draft.translations[i].body;
      }
    });

    if (draft.publishDate === undefined) {
      delete draft.publishDate;
    }
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
    for (const [key, value] of Object.entries(draft.bannerImage)) {
      type Key = keyof typeof draft.bannerImage;
      if (value === undefined) {
        delete draft.bannerImage[key as Key];
      }
    }

    for (const [key, value] of Object.entries(draft.summaryImage)) {
      type Key = keyof typeof draft.summaryImage;
      if (value === undefined) {
        delete draft.summaryImage[key as Key];
      }
    }

    draft.translations.forEach((_translation, i) => {
      if (draft.translations[i].description === undefined) {
        delete draft.translations[i].description;
      }
      if (draft.translations[i].summary.general === undefined) {
        delete draft.translations[i].summary.general;
      }
      if (draft.translations[i].title === undefined) {
        delete draft.translations[i].title;
      }
    });

    if (draft.publishDate === undefined) {
      delete draft.publishDate;
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
    draft.translations.forEach((_translation, i) => {
      if (draft.translations[i].title === undefined) {
        delete draft.translations[i].title;
      }
    });

    if (draft.publishDate === undefined) {
      delete draft.publishDate;
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

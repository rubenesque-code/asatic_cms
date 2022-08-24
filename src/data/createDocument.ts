import { default_language_Id } from "^constants/data";

import { Article } from "^types/article";
import { Author } from "^types/author";
import { Blog } from "^types/blog";
import { Collection } from "^types/collection";
import { RecordedEvent } from "^types/recordedEvent";

export const createNewArticle = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): Article => ({
  id,
  publishInfo: {
    status: "draft",
  },
  authorIds: [],
  collectionIds: [],
  subjectIds: [],
  tagIds: [],
  translations: [
    {
      id: translationId,
      languageId: default_language_Id,
      body: [],
      landingPage: {},
    },
  ],
  type: "article",
  landing: {
    useImage: true,
    autoSection: {
      imgVertPosition: 50,
    },
    customSection: {
      imgVertPosition: 50,
      imgAspectRatio: 16 / 9,
    },
  },
  lastSave: null,
});

export const createNewBlog = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): Blog => ({
  id,
  publishInfo: {
    status: "draft",
  },
  authorIds: [],
  collectionIds: [],
  subjectIds: [],
  tagIds: [],
  translations: [
    {
      id: translationId,
      languageId: default_language_Id,
      body: [],
      landingPage: {},
    },
  ],
  type: "blog",
  lastSave: null,
});

export const createNewRecordedEvent = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): RecordedEvent => ({
  authorsIds: [],
  collectionsIds: [],
  id,
  landingImage: {
    autoSection: {
      imgVertPosition: 50,
    },
    customSection: {
      imgAspectRatio: 16 / 9,
      imgVertPosition: 50,
    },
  },
  lastSave: null,
  publishStatus: "draft",
  subjectsIds: [],
  tagsIds: [],
  translations: [
    {
      id: translationId,
      // todo: should be english explicitly?
      languageId: default_language_Id,
    },
  ],
  type: "recorded-event",
});

export const createAuthor = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): Author => ({
  id,
  translations: [
    { id: translationId, languageId: default_language_Id, name: "" },
  ],
});

export const createCollection = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): Collection => ({
  id,
  image: {
    vertPosition: 50,
  },
  landing: {
    autoSection: {
      imgVertPosition: 50,
    },
  },
  lastSave: null,
  publishStatus: "draft",
  subjectsIds: [],
  translations: [
    { id: translationId, label: "", languageId: default_language_Id },
  ],
  type: "collection",
  tagsIds: [],
});

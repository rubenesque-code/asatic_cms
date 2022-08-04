import { default_language_Id } from "^constants/data";

import { Article } from "^types/article";
import { Author } from "^types/author";
import { Blog } from "^types/blog";
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
  summaryImage: {
    useImage: true,
    style: {
      vertPosition: 50,
      aspectRatio: 16 / 9,
    },
  },
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
  summaryImage: {
    useImage: true,
    style: {
      vertPosition: 50,
      aspectRatio: 16 / 9,
    },
  },
});

export const createNewRecordedEvent = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): RecordedEvent => ({
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
      body: null,
    },
  ],
  type: "recorded-event",
  summaryImage: {},
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

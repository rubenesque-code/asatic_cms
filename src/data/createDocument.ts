import { default_language_Id } from "^constants/data";

import { Article } from "^types/article";
import {
  ArticleLikeImageSection,
  ArticleLikeTextSection,
  ArticleLikeVideoSection,
} from "^types/article-like-entity";
import { Author } from "^types/author";
import { Blog } from "^types/blog";
import { Collection } from "^types/collection";
import { RecordedEvent } from "^types/recordedEvent";

export const createArticleLikeImageSection = ({
  id,
  index,
}: {
  id: string;
  index: number;
}): ArticleLikeImageSection => ({
  id,
  image: {
    style: { aspectRatio: 16 / 9, vertPosition: 50 },
  },
  index,
  type: "image",
});

export const createArticleLikeTextSection = ({
  id,
  index,
}: {
  id: string;
  index: number;
}): ArticleLikeTextSection => ({
  id,
  index,
  type: "text",
});

export const createArticleLikeVideoSection = ({
  id,
  index,
}: {
  id: string;
  index: number;
}): ArticleLikeVideoSection => ({
  id,
  index,
  type: "video",
  video: {},
});

export const createArticle = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): Article => ({
  authorsIds: [],
  collectionsIds: [],
  id,
  lastSave: null,
  publishStatus: "draft",
  subjectsIds: [],
  tagsIds: [],
  translations: [
    { id: translationId, body: [], languageId: default_language_Id },
  ],
  type: "article",
  landingCustomSection: {
    imgAspectRatio: 16 / 9,
    imgVertPosition: 50,
  },
  summaryImage: {
    useImage: true,
  },
});

export const createBlog = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): Blog => ({
  authorsIds: [],
  collectionsIds: [],
  id,
  lastSave: null,
  publishStatus: "draft",
  subjectsIds: [],
  tagsIds: [],
  translations: [
    { id: translationId, body: [], languageId: default_language_Id },
  ],
  type: "blog",
  landingCustomSection: {
    imgAspectRatio: 16 / 9,
    imgVertPosition: 50,
  },
  summaryImage: {
    useImage: true,
  },
});

export const createRecordedEvent = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): RecordedEvent => ({
  authorsIds: [],
  collectionsIds: [],
  id,
  lastSave: null,
  publishStatus: "draft",
  subjectsIds: [],
  tagsIds: [],
  translations: [
    {
      id: translationId,
      languageId: default_language_Id,
    },
  ],
  type: "recorded-event",
  landingCustomSection: {
    imgAspectRatio: 16 / 9,
    imgVertPosition: 50,
  },
  summaryImage: {
    useImage: true,
  },
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
  languageId,
  title,
  translationId,
}: {
  id: string;
  languageId?: string | undefined;
  title: string;
  translationId: string;
}): Collection => ({
  id,
  lastSave: null,
  publishStatus: "draft",
  subjectsIds: [],
  translations: [
    {
      id: translationId,
      title,
      languageId: languageId || default_language_Id,
    },
  ],
  type: "collection",
  tagsIds: [],
  bannerImage: {
    vertPosition: 50,
  },
  summaryImage: {
    useImage: true,
  },
});

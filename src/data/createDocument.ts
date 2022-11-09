import { default_language_Id } from "^constants/data";

import { Article } from "^types/article";
import {
  ImageSection as ArticleLikeImageSection,
  TextSection as ArticleLikeTextSection,
  VideoSection as ArticleLikeVideoSection,
} from "^types/article-like-entity";
import { Author } from "^types/author";
import { Blog } from "^types/blog";
import { Collection } from "^types/collection";
import { PublishFields, RelatedEntityFields, SaveFields } from "^types/entity";
import { LandingCustomSectionImageField } from "^types/entity-image";
import { RecordedEvent } from "^types/recordedEvent";
import { Subject } from "^types/subject";

export const createArticleLikeImageSection = ({
  id,
  index,
}: {
  id: string;
  index: number;
}): ArticleLikeImageSection => ({
  id,
  image: {},
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
});

const primaryEntitySharedFields: RelatedEntityFields<
  "author" | "collection" | "subject" | "tag"
> &
  SaveFields &
  PublishFields &
  LandingCustomSectionImageField = {
  authorsIds: [],
  collectionsIds: [],
  subjectsIds: [],
  tagsIds: [],
  lastSave: null,
  publishStatus: "draft",
  landingCustomSectionImage: {},
};

export const createArticle = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): Article => ({
  ...primaryEntitySharedFields,
  id,
  translations: [
    {
      body: [],
      id: translationId,
      languageId: default_language_Id,
      summary: {},
    },
  ],
  type: "article",
  summaryImage: {},
});

export const createBlog = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): Blog => ({
  ...primaryEntitySharedFields,
  id,
  translations: [
    {
      body: [],
      id: translationId,
      languageId: default_language_Id,
      summary: {},
    },
  ],
  type: "blog",
  summaryImage: {},
});

export const createRecordedEvent = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): RecordedEvent => ({
  ...primaryEntitySharedFields,
  id,
  translations: [
    {
      id: translationId,
      languageId: default_language_Id,
    },
  ],
  type: "recordedEvent",
  summaryImage: {},
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
  articlesIds: [],
  blogsIds: [],
  recordedEventsIds: [],
  lastSave: null,
  publishStatus: "draft",
  subjectsIds: [],
  translations: [
    {
      id: translationId,
      languageId: languageId || default_language_Id,
      summary: {},
      title,
    },
  ],
  type: "collection",
  tagsIds: [],
  bannerImage: {},
  summaryImage: {},
});

export const createSubject = ({
  id,
  languageId,
  translationId,
  translationName,
}: {
  id: string;
  languageId?: string | undefined;
  translationName?: string;
  translationId: string;
}): Subject => ({
  id,
  articlesIds: [],
  blogsIds: [],
  recordedEventsIds: [],
  lastSave: null,
  publishStatus: "draft",
  translations: [
    {
      id: translationId,
      languageId: languageId || default_language_Id,
      name: translationName,
    },
  ],
  type: "subject",
  tagsIds: [],
  collectionsIds: [],
});

export const createAuthor = ({
  id,
  languageId,
  translationId,
}: {
  id: string;
  languageId?: string;
  translationId: string;
}): Author => ({
  id,
  translations: [
    {
      id: translationId,
      languageId: languageId || default_language_Id,
      name: "",
    },
  ],
  articlesIds: [],
  blogsIds: [],
  recordedEventsIds: [],
  type: "author",
});

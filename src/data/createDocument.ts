import { nanoid } from "@reduxjs/toolkit";

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
import { Language } from "^types/language";
import { RecordedEvent } from "^types/recordedEvent";
import { RecordedEventType } from "^types/recordedEventType";
import { Subject } from "^types/subject";
import { Tag } from "^types/tag";
import { MyOmit } from "^types/utilities";

//* entities that can be created by inputting titular field, can also be created without inputting a titular field
//* these titular fields are then conditional
//* e.g. author.translation.name

export const createArticleLikeImageSection = ({
  id,
  index,
}: {
  id: string;
  index: number;
}): ArticleLikeImageSection => ({
  id,
  image: {
    imageId: null,
    vertPosition: 50,
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
});

type DocumentEntitySharedFields = {
  [k in keyof Article & keyof Blog & keyof RecordedEvent]:
    | Article[k]
    | Blog[k]
    | RecordedEvent[k];
};

const documentEntitySharedFields: MyOmit<
  DocumentEntitySharedFields,
  "type" | "translations" | "summaryImage"
> = {
  authorsIds: [],
  collectionsIds: [],
  id: nanoid(),
  publishStatus: "draft",
  publishDate: null,
  subjectsIds: [],
  tagsIds: [],
  lastSave: null,
};

type ArticleLikeEntitySharedFields = {
  [k in keyof Article | keyof Blog]: Article[k] | Blog[k];
};

const articleLikeEntitySharedFields: Pick<
  ArticleLikeEntitySharedFields,
  "summaryImage" | "translations"
> = {
  summaryImage: {
    imageId: null,
    useImage: true,
    vertPosition: 50,
  },

  translations: [
    {
      body: [],
      id: nanoid(),
      languageId: default_language_Id,
    },
  ],
};

export const createArticle = (): Article => ({
  ...documentEntitySharedFields,
  ...articleLikeEntitySharedFields,
  type: "article",
});

export const createBlog = (): Blog => ({
  ...documentEntitySharedFields,
  ...articleLikeEntitySharedFields,
  type: "blog",
});

export const createRecordedEvent = (): RecordedEvent => ({
  ...documentEntitySharedFields,
  translations: [
    {
      id: nanoid(),
      languageId: default_language_Id,
    },
  ],
  type: "recordedEvent",
  summaryImage: {
    imageId: null,
    vertPosition: 50,
  },
  recordedEventTypeId: null,
});

export const createCollection = (
  args: {
    id?: string;
    translation?: {
      id?: string;
      languageId?: string;
      description?: string;
      title?: string;
    };
  } | void
): Collection => ({
  id: args?.id || nanoid(),
  articlesIds: [],
  blogsIds: [],
  recordedEventsIds: [],
  lastSave: null,
  publishStatus: "draft",
  subjectsIds: [],
  translations: [
    {
      id: args?.translation?.id || nanoid(),
      languageId: args?.translation?.languageId || default_language_Id,
      description: args?.translation?.description,
      title: args?.translation?.title,
    },
  ],
  type: "collection",
  tagsIds: [],
  bannerImage: {},
  summaryImage: {
    imageId: null,
    vertPosition: 50,
  },
});

export const createSubject = ({
  languageId,
  id,
  title,
}: {
  id?: string;
  languageId: string;
  title?: string;
}): Subject => ({
  id: id || nanoid(),
  articlesIds: [],
  blogsIds: [],
  recordedEventsIds: [],
  lastSave: null,
  publishStatus: "draft",
  languageId,
  title,
  type: "subject",
  tagsIds: [],
  collectionsIds: [],
});

export const createAuthor = (
  args: {
    id?: string;
    translation?: {
      id?: string;
      languageId?: string;
      name?: string;
    };
  } | void
): Author => ({
  id: args?.id || nanoid(),
  translations: [
    {
      id: args?.translation?.id || nanoid(),
      languageId: args?.translation?.languageId || default_language_Id,
      name: args?.translation?.name,
    },
  ],
  articlesIds: [],
  blogsIds: [],
  recordedEventsIds: [],
  type: "author",
});

export const createRecordedEventType = (
  args: {
    id?: string;
    translation?: {
      id?: string;
      languageId?: string;
      name?: string;
    };
  } | void
): RecordedEventType => ({
  id: args?.id || nanoid(),
  translations: [
    {
      id: args?.translation?.id || nanoid(),
      languageId: args?.translation?.id || default_language_Id,
      name: args?.translation?.name,
    },
  ],
  recordedEventsIds: [],
  type: "recordedEventType",
});

export const createTag = (
  args: {
    id?: string;
    text?: string;
  } | void
): Tag => ({
  id: args?.id || nanoid(),
  articlesIds: [],
  blogsIds: [],
  recordedEventsIds: [],
  type: "tag",
  collectionsIds: [],
  subjectsIds: [],
  text: args?.text,
});

export const createLanguage = ({ name }: { name: string }): Language => ({
  id: name,
  name: name,
});

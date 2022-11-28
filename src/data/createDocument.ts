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
import { PublishFields, RelatedEntityFields, SaveFields } from "^types/entity";
import { LandingCustomSectionImageField } from "^types/entity-image";
import { Language } from "^types/language";
import { RecordedEvent } from "^types/recordedEvent";
import { RecordedEventType } from "^types/recordedEventType";
import { Subject } from "^types/subject";
import { Tag } from "^types/tag";

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

export const createArticle = (): Article => ({
  ...primaryEntitySharedFields,
  id: nanoid(),
  translations: [
    {
      body: [],
      id: nanoid(),
      languageId: default_language_Id,
      summary: {},
    },
  ],
  type: "article",
  summaryImage: {},
});

export const createBlog = (): Blog => ({
  ...primaryEntitySharedFields,
  id: nanoid(),
  translations: [
    {
      body: [],
      id: nanoid(),
      languageId: default_language_Id,
      summary: {},
    },
  ],
  type: "blog",
  summaryImage: {},
});

export const createRecordedEvent = (): RecordedEvent => ({
  ...primaryEntitySharedFields,
  id: nanoid(),
  translations: [
    {
      id: nanoid(),
      languageId: default_language_Id,
    },
  ],
  type: "recordedEvent",
  summaryImage: {},
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
      summary: {},
      description: args?.translation?.description,
      title: args?.translation?.title,
    },
  ],
  type: "collection",
  tagsIds: [],
  bannerImage: {},
  summaryImage: {},
});

export const createSubject = (
  args: {
    id?: string;
    translation?: {
      id?: string;
      languageId?: string;
      name?: string;
    };
  } | void
): Subject => ({
  id: args?.id || nanoid(),
  articlesIds: [],
  blogsIds: [],
  recordedEventsIds: [],
  lastSave: null,
  publishStatus: "draft",
  translations: [
    {
      id: args?.translation?.id || nanoid(),
      languageId: args?.translation?.languageId || default_language_Id,
      name: args?.translation?.name,
    },
  ],
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

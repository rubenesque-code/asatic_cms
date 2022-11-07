import { DisplayEntityStatus } from "./entity-status";
import {
  EntityGlobalFields,
  EntityNameSubSet,
  PublishFields,
  RelatedDisplayEntityFields,
  RelatedSubEntityFields,
  SaveFields,
} from "./entity";
import {
  RichText,
  SummaryField,
  TranslationField,
  Translations,
} from "./entity-translation";
import { ImageFields, SummaryImageField } from "./entity-image";

export type Collection = EntityGlobalFields<"collection"> & {
  bannerImage: ImageFields<"id" | "y-position">;
} & RelatedDisplayEntityFields<
    "article" | "blog" | "recordedEvent" | "subject"
  > &
  RelatedSubEntityFields<"author" | "tag"> &
  PublishFields &
  SaveFields &
  Translations<CollectionTranslationFields> &
  SummaryImageField<"isNotToggleable">;

type CollectionTranslationFields = TranslationField<"title"> & {
  description?: RichText;
} & SummaryField<"general">;

export type CollectionTranslation = Collection["translations"][number];

export type CollectionRelatedEntity = EntityNameSubSet<
  "article" | "blog" | "recordedEvent" | "subject" | "tag"
>;

export type CollectionStatus = DisplayEntityStatus<CollectionRelatedEntity>;

/*
const collection: Collection = {
  articlesIds: [],
  authorsIds: [],
  bannerImage: { imageId: "", vertPosition: 50 },
  blogsIds: [],
  id: "",
  lastSave: new Date(),
  publishStatus: "draft",
  recordedEventsIds: [],
  subjectsIds: [],
  summaryImage: { imageId: "", vertPosition: 50 },
  tagsIds: [],
  translations: [
    {
      description: "",
      id: "",
      languageId: "",
      summary: { general: "" },
      title: "",
    },
  ],
  type: "collection",
  publishDate: new Date(),
};
*/

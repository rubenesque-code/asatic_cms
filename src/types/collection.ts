import { DisplayEntityStatus, EntityAsChildStatus } from "./entity-status";
import {
  EntityGlobalFields,
  EntityNameTupleSubset,
  PublishFields,
  RelatedEntityFields,
  SaveFields,
} from "./entity";
import { ImageFields, SummaryImageField } from "./entity-image";
import { TupleToUnion } from "./utilities";

export type Collection = EntityGlobalFields<"collection"> & {
  bannerImage: ImageFields<"id" | "y-position">;
  languageId: "english" | "tamil";
} & RelatedEntityFields<CollectionRelatedEntity> &
  PublishFields &
  SaveFields &
  SummaryImageField<"isNotToggleable"> & {
    languageId: string;
    description?: string;
    summary?: string;
    title: string;
  };

export type CollectionRelatedEntityTuple = EntityNameTupleSubset<
  "article" | "blog" | "recordedEvent" | "subject" | "tag"
>;

export type CollectionRelatedEntity =
  TupleToUnion<CollectionRelatedEntityTuple>;

export type InvalidReason =
  | "no banner image"
  | "no valid translation"
  | "no valid related diplay entity";

export type CollectionStatus = DisplayEntityStatus<
  CollectionRelatedEntity,
  InvalidReason
>;

export type ChildCollectionMissingRequirement =
  | "no banner image"
  | "no valid translation";

export type CollectionAsChildStatus =
  EntityAsChildStatus<ChildCollectionMissingRequirement>;

/*
const collection: Collection = {
  articlesIds: [],
  bannerImage: {
    imageId: "", // ?
    vertPosition: 50, // ?
  },
  blogsIds: [],
  id: "",
  lastSave: new Date(),
  publishStatus: "draft",
  recordedEventsIds: [],
  subjectsIds: [],
  summaryImage: {
    imageId: "", // ?
    vertPosition: 50, // ?
  },
  tagsIds: [],
  translations: [
    {
      description: "", // ?
      id: "",
      languageId: "",
      summary: {
        general: "", // ?
      },
      title: "", // ?
    },
  ],
  type: "collection",
  publishDate: new Date(), // ?
};
*/

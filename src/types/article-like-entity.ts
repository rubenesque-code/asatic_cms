import { Expand, TupleToUnion } from "./utilities";

import { ImageFields } from "./entity-image";
import { RichText, SummaryField, TranslationField } from "./entity-translation";

import {
  EntityGlobalFields,
  PublishFields,
  SaveFields,
  EntityNameSubSet,
  ComponentFields,
  MediaFields,
  RelatedEntityFields,
  EntityNameTupleSubset,
} from "./entity";
import { Translations } from "./entity-translation";
import {
  SummaryImageField,
  LandingCustomSectionImageField,
} from "./entity-image";
import { DisplayEntityStatus } from "./entity-status";

type SectionTypes = "text" | "image" | "video";

type Section<TType extends SectionTypes> = ComponentFields<"id" | "index"> & {
  type: TType;
};

export type TextSection = Section<"text"> & { text?: RichText };

export type ImageSection = Section<"image"> &
  MediaFields<"caption"> & {
    image: ImageFields<"aspect-ratio" | "id" | "y-position">;
  };

export type VideoSection = Section<"video"> &
  MediaFields<"caption" | "youtubeId">;

type ArticleLikeTranslationFields = TranslationField<"title"> & {
  body: (Expand<TextSection> | Expand<ImageSection> | Expand<VideoSection>)[];
} & SummaryField<"collection" | "general" | "landingCustomSection">;

type ArticleLikeEntityName = EntityNameSubSet<"article" | "blog">;

export type ArticleLikeEntity<TEntityName extends ArticleLikeEntityName> =
  EntityGlobalFields<TEntityName> &
    RelatedEntityFields<ArticleLikeRelatedEntityUnion> &
    PublishFields &
    SaveFields &
    Translations<ArticleLikeTranslationFields> &
    SummaryImageField<"isToggleable"> &
    LandingCustomSectionImageField;

export type ArticleLikeTranslation =
  Translations<ArticleLikeTranslationFields>["translations"][number];

export type ArticleLikeRelatedEntityTuple = EntityNameTupleSubset<
  "author" | "collection" | "subject" | "tag"
>;

export type ArticleLikeRelatedEntityUnion =
  TupleToUnion<ArticleLikeRelatedEntityTuple>;

type InvalidReason = "no valid translation";

export type ArticleLikeStatus = DisplayEntityStatus<
  ArticleLikeRelatedEntityUnion,
  InvalidReason
>;

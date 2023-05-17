import { Column } from "react-table";

import { Expand, TupleToUnion } from "./utilities";

import { ImageFields } from "./entity-image";
import { RichText, TranslationField } from "./entity-translation";

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
import { SummaryImageField } from "./entity-image";
import { DisplayEntityStatus } from "./entity-status";

type SectionTypes = "text" | "image" | "video" | "table";

type Section<TType extends SectionTypes> = ComponentFields<"id" | "index"> & {
  type: TType;
};

export type TextSection = Section<"text"> & {
  text?: RichText;
  footnotes?: Footnote[];
};

export type ImageSection = Section<"image"> &
  MediaFields<"caption"> & {
    image: ImageFields<"id" | "y-position" | "aspect-ratio">;
  };

export type VideoSection = Section<"video"> &
  MediaFields<"caption" | "youtubeId">;

export type TableSection = Section<"table"> & {
  title: string | null;
  notes: string | null;
  columns: Column[];
  rows: ({ col1: string } & Record<string, unknown>)[];
  col1IsTitular: boolean;
};

export type Footnote = { id: string; num: number; text: string };

type ArticleLikeTranslationFields = TranslationField<"title"> & {
  body: (
    | Expand<TextSection>
    | Expand<ImageSection>
    | Expand<VideoSection>
    | TableSection
  )[];
  summary?: string;
};

type ArticleLikeEntityName = EntityNameSubSet<"article" | "blog">;

export type ArticleLikeEntity<TEntityName extends ArticleLikeEntityName> =
  EntityGlobalFields<TEntityName> &
    RelatedEntityFields<ArticleLikeRelatedEntityUnion> &
    PublishFields &
    SaveFields &
    Translations<ArticleLikeTranslationFields> &
    SummaryImageField<"isToggleable">;

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

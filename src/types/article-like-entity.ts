import { Expand } from "./utilities";

import { ImageFields } from "./entity-image";
import {
  RichText,
  SummaryFields,
  TranslationField,
} from "./entity-translation";

import {
  EntityGlobalFields,
  PublishFields,
  RelatedDisplayEntityFields,
  RelatedSubEntityFields,
  SaveFields,
  EntityNameSubSet,
  ComponentFields,
  MediaFields,
} from "./entity";
import { Translations } from "./entity-translation";
import {
  SummaryImageField,
  LandingCustomSectionImageField,
} from "./entity-image";

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

export type ArticleLikeTranslation = TranslationField<"title"> & {
  body: (Expand<TextSection> | Expand<ImageSection> | Expand<VideoSection>)[];
} & SummaryFields<"collection" | "general" | "landingCustomSection">;

type ArticleLikeEntityName = EntityNameSubSet<"article" | "blog">;

export type ArticleLikeEntity<TEntityName extends ArticleLikeEntityName> =
  EntityGlobalFields<TEntityName> &
    RelatedDisplayEntityFields<"collection" | "subject"> &
    RelatedSubEntityFields<"author" | "tag"> &
    PublishFields &
    SaveFields &
    Translations<ArticleLikeTranslation> &
    SummaryImageField<"isToggleable"> &
    LandingCustomSectionImageField;

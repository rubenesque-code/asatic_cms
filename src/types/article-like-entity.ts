import { Expand } from "./utilities";

import { ImageFields } from "./entity-image";
import { SummaryFields } from "./entity-translation";

import {
  EntityGlobal,
  PublishFields,
  RelatedDisplayEntityFields,
  RelatedSubEntityFields,
  SaveFields,
  EntityNameSubSet,
} from "./entity";
import { Translations } from "./entity-translation";
import {
  SummaryImageField,
  LandingCustomSectionImageField,
} from "./entity-image";

export type ArticleLikeTextSection = {
  type: "text";
  text?: string;
  index: number;
  id: string;
};

export type ArticleLikeImageSection = {
  type: "image";
  caption?: string;
  image: ImageFields<"aspectRatio" | "imageId" | "vertPosition">;
  index: number;
  id: string;
};

export type ArticleLikeVideoSection = {
  type: "video";
  youtubeId?: string;
  caption?: string;
  index: number;
  id: string;
};

export type ArticleLikeTranslation = {
  title?: string;
  body: (
    | Expand<ArticleLikeTextSection>
    | Expand<ArticleLikeImageSection>
    | Expand<ArticleLikeVideoSection>
  )[];
} & SummaryFields<"collection" | "general" | "landingCustomSection">;

type ArticleLikeEntityName = EntityNameSubSet<"article" | "blog">;

export type ArticleLikeEntity<TEntityName extends ArticleLikeEntityName> =
  EntityGlobal<TEntityName> &
    RelatedDisplayEntityFields<"collection" | "subject"> &
    RelatedSubEntityFields<"author" | "tag"> &
    PublishFields &
    SaveFields &
    Translations<ArticleLikeTranslation> &
    SummaryImageField<"isToggleable"> &
    LandingCustomSectionImageField;

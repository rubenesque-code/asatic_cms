import { Expand } from "./utilities";

export type DisplayEntityStatus<TContentSpecificError extends string> =
  | "new"
  | "draft"
  | "good"
  | "invalid"
  | { status: "error"; errors: TContentSpecificError[] };

export type Publishable = {
  publishStatus: Expand<PublishStatus>;
  publishDate?: Date;
};

type PublishStatus = "published" | "draft";

export type TrackSave = {
  lastSave: Date | null;
};

/**used by article, blog + recorded-event in: landing-auto, landing-custom + collection. Used by collection in landing-auto (but without option to not use) */
export type SummaryImage = {
  summaryImage: {
    useImage: boolean;
    imageId?: string;
    vertPosition?: number;
  };
};

export type SecondaryContentFields = {
  authorsIds: string[];
  collectionsIds: string[];
  subjectsIds: string[];
  tagsIds: string[];
};

export type DisplayEntityType<
  TType extends "article" | "blog" | "collection" | "recorded-event"
> = {
  type: TType;
};

export type DisplayEntity = Publishable & TrackSave & SummaryImage;

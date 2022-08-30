import { Expand } from "./utilities";

export type Publishable = {
  publishStatus: Expand<PublishStatus>;
  publishDate?: Date;
};

type PublishStatus = "published" | "draft";

export type TrackSave = {
  lastSave: Date | null;
};

export type TranslationGeneric = {
  id: string;
  languageId: string;
};

export type LandingImageFields = {
  useImage: boolean;
  imageId?: string;
  autoSection: {
    imgVertPosition: number;
  };
  customSection: {
    imgAspectRatio: number;
    imgVertPosition: number;
  };
};

export type SecondaryContentFields = {
  authorsIds: string[];
  collectionsIds: string[];
  subjectsIds: string[];
  tagsIds: string[];
};

export type DisplayContentErrors = { status: "error"; errors: string[] };
export type DisplayContentStatus =
  | "new"
  | "draft"
  | "good"
  | "invalid"
  | DisplayContentErrors;

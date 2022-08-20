import { Expand } from "./utilities";

export type Publishable = {
  publishStatus: Expand<PublishStatus>;
  publishDate?: Date;
};

export type TrackSave = {
  lastSave: Date | null;
};

export type PublishStatus = "published" | "draft";

export type TranslationGeneric = {
  id: string;
  languageId: string;
};

export type LandingFields = {
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

import {
  DisplayEntityStatus,
  DisplayEntity,
  SecondaryContentFields,
} from "./display-entity";

export type LandingCustomSection = {
  landingCustomSection: {
    imgAspectRatio: number;
    imgVertPosition: number;
  };
};

export type PrimaryEntityError =
  | "missing language"
  | "missing author"
  | "missing author translation"
  | "missing collection"
  | "missing collection translation"
  | "missing subject"
  | "missing subject translation"
  | "missing tag";

export type PrimaryEntityStatus = DisplayEntityStatus<PrimaryEntityError>;

export type PrimaryEntityType = "article" | "blog" | "recorded-event";

export type PrimaryEntity = DisplayEntity &
  LandingCustomSection &
  SecondaryContentFields;

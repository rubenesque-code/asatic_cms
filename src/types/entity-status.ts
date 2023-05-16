import { EntityName } from "./entity";

export type DisplayEntityStatus<
  TRelatedEntity extends EntityName,
  TInvalidReason extends string
> =
  | "new"
  | "draft"
  | "good"
  | { status: "invalid"; reasons: TInvalidReason[] }
  | { status: "warning"; warnings: EntityWarning<TRelatedEntity> };

export type EntityWarning<TRelatedEntity extends EntityName> = {
  ownTranslationsWithoutRequiredField: { languageId: string }[];
  relatedEntitiesMissing: (TRelatedEntity | "language")[];
  relatedEntitiesInvalid: (TRelatedEntity | "language")[];
};

export type EntityAsChildStatus<TMissingRequirement extends string> =
  | "undefined"
  | "draft"
  | { status: "invalid"; missingRequirements: TMissingRequirement[] }
  | { status: "warning"; warnings: "missing translation for parent language"[] }
  | "good";

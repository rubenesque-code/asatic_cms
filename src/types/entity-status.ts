import { EntityName, EntityNameSubSet } from "./entity";

// check status of display entities (article, blog, collection, recorded-event and subject).
// other entities are sub-entities (author and tag) and don't need to be checked for their status.

// new = unsaved (no other concern).
// draft = unpublished (no other concern).
// good = published + required fields met + no errors.
// invalid = published + required fields not met.
// error = published + valid + errors (e.g. missing required field in a translation).

export type DisplayEntityStatus<TRelatedEntity extends EntityName> =
  | "new"
  | "draft"
  | "good"
  | "invalid"
  | { status: "warning"; warnings: EntityWarning<TRelatedEntity> };

// ERRORS
// n.b: if entity is status "error", it's valid
// errors: (* need to update below; e.g. check collection status selector)
// - is translation without required fields;
// - missing related entity (from store).
// - missing related entity translation (for entity language).
// - missing related entity translation fields. E.g. collection needs related article translation to have a title and text.

export type EntityWarning<TRelatedEntity extends EntityName> = {
  ownTranslationsWithoutRequiredField: { languageId: string }[];
  relatedEntitiesMissing: (TRelatedEntity | "language")[];
  relatedEntitiesInvalid: (TRelatedEntity | "language")[];
  // relatedEntitiesWithoutTranslation: Exclude<TRelatedEntity, "tag">[];
  // missingRelatedEntityTranslationFields: Exclude<TRelatedEntity, "tag">[];
};

type PrimaryEntityRelatedEntity = EntityNameSubSet<
  "author" | "collection" | "subject" | "tag"
>;

export type PrimaryEntityStatus =
  DisplayEntityStatus<PrimaryEntityRelatedEntity>;

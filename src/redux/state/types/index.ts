export type EntityPayloadGeneric = { id: string };
export type TranslationPayloadGeneric = EntityPayloadGeneric & {
  translationId: string;
};

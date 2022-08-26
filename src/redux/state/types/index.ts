import { Expand } from "^types/utilities";

export type EntityPayloadGeneric = { id: string };
export type TranslationPayloadGeneric = Expand<EntityPayloadGeneric> & {
  translationId: string;
};

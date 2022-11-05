// * removed landingAutoSection summary; landingAutoSection summary and subject summary come under general as don't need such control over them.
type SummaryFieldsMap = {
  collection?: string;
  landingCustomSection?: string;
  general?: string;
};

export type SummaryFields<TSummary extends keyof SummaryFieldsMap> = Pick<
  SummaryFieldsMap,
  TSummary
>;

type TranslationFieldsMap = {
  id: string;
  languageId: string;
  title?: string;
  description?: string;
  name?: string;
  text?: string;
};

export type TranslationField<TField extends keyof TranslationFieldsMap> = Pick<
  TranslationFieldsMap,
  TField
>;

export type RichText = string;

export type Translations<TTranslation extends Record<string, unknown>> = {
  translations: (TTranslation & TranslationField<"id" | "languageId">)[];
};

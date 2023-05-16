// removed landingAutoSection summary; landingAutoSection summary and subject summary come under general as don't need such control over them.

// type SummaryLabel = 'default' | 'collection' | 'landing-custom-section'

type SummaryFieldsMap = {
  collection?: string;
  landingCustomSection?: string;
  general?: string;
};

export type SummaryField<TSummary extends keyof SummaryFieldsMap> = {
  summary: Pick<SummaryFieldsMap, TSummary>;
};

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

export type TranslationGlobalFields = TranslationField<"id" | "languageId">;

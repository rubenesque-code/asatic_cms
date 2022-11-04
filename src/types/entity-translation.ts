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

export type Translations<TTranslation extends Record<string, unknown>> = {
  translations: (TTranslation & { id: string; languageId: string })[];
};

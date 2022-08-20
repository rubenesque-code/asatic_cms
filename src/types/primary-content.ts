export type PrimaryContentType = "article" | "blog" | "recorded-event";

type PublishStatus = "published" | "draft";

export type Translation = {
  id: string;
  languageId: string;
  title?: string;
};

export type SubContentKeys = {
  authorIds: string[];
  collectionIds: string[];
  subjectIds: string[];
  tagIds: string[];
};

export type SubContentType = "author" | "collection" | "subject" | "tag";

export type PrimaryContent<
  TTranslation extends Translation,
  TType extends PrimaryContentType
> = {
  id: string;
  type: TType;
  lastSave: Date | null;
  publishInfo: {
    status: PublishStatus;
    date?: Date;
  };
  translations: TTranslation[];
} & SubContentKeys;

// todo: this also refers to 'collections (in landing)' so needs to be somewhere else now.
export type ContentStatus<TContentSpecificError extends string> =
  | "new"
  | "draft"
  | "good"
  | "invalid"
  | { status: "error"; errors: TContentSpecificError[] };

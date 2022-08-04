export type EditableContent = {
  id: string;
  lastSave?: Date;
};

export type EditableDocType = "recorded-event" | "article" | "blog";

export type PublishStatus = "published" | "draft";

export type Document<DocTranslation> = EditableContent & {
  // defaultTranslationId: string;
  publishInfo: {
    status: PublishStatus;
    date?: Date;
  };
  tagIds: string[];
  translations: DocTranslation[];
  type: EditableDocType;
};

export type Translation = {
  id: string;
  languageId: string;
};

export type AuthorId = string | null;

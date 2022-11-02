export type Tag = {
  id: string;
  text: string;
  relatedEntities: {
    type: "article" | "blog" | "collection" | "recorded-event";
    entityId: string;
  }[];
};

export type Tags = Tag[];

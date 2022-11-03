export type Tag = {
  id: string;
  text: string;
  articlesIds: string[];
  blogsIds: string[];
  recordedEventsIds: string[];
};

export type Tags = Tag[];

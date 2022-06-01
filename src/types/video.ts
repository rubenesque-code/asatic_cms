export type Video = {
  id: string;
  relatedArticleIds?: string[];
  videoData: Youtube;
};

type Youtube = {
  type: "youtube";
  youtubeId: string;
};

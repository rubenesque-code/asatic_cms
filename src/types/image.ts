export type Image = {
  id: string;
  URLstorageId: string;
  URL: string;
  blurURL: string;
  blurURLstorageId: string;
  relatedArticleIds?: string[];
  keywords: string[];
};

export type ImageKeyword = {
  id: string;
  text: string;
};

export type ImageKeywords = ImageKeyword[];

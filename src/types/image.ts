export type Image = {
  id: string;
  URLstorageId: string;
  URL: string;
  blurURL: string;
  blurURLstorageId: string;
  keywords: ImageKeyword[];
};

export type ImageKeyword = {
  id: string;
  text: string;
};

export type ImageKeywords = ImageKeyword[];

export type ResizableImage = {
  vertPosition: number;
  aspectRatio: number;
};

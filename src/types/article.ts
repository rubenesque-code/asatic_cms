import { ArticleLikeContent } from "./article-like-primary-content";

export type Article = ArticleLikeContent<"article"> & {
  landing: {
    useImage: boolean;
    imageId?: string;
    autoSection: {
      imgVertPosition: number;
    };
    customSection: {
      imgAspectRatio: number;
      imgVertPosition: number;
    };
  };
};

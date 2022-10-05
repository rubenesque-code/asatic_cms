import { ArticleLikeTranslation } from "./article-like-entity";
import { DisplayEntityType } from "./display-entity";
import { PrimaryEntity } from "./primary-entity";

export type Article = {
  id: string;
  translations: ArticleLikeTranslation[];
} & PrimaryEntity &
  DisplayEntityType<"article">;

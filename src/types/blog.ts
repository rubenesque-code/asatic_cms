import { ArticleLikeTranslation } from "./article-like-entity";
import { DisplayEntityType } from "./display-entity";
import { PrimaryEntity } from "./primary-entity";

export type Blog = {
  id: string;
  translations: ArticleLikeTranslation[];
} & PrimaryEntity &
  DisplayEntityType<"blog">;

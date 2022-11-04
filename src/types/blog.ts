import { ArticleLikeTranslation } from "./article-like-entity";
import { DisplayEntityType } from "./display-entity";
import { PrimaryEntity } from "./primary-entity";

export type Blog = {
  id: string;
  translations: ArticleLikeTranslation[];
} & PrimaryEntity &
  DisplayEntityType<"blog">;

const b: Blog = {
  authorsIds: [],
  collectionsIds: [],
  id: "",
  landingCustomSection: {
    imgAspectRatio: 16 / 9,
    imgVertPosition: 50,
  },
  lastSave: null,
  publishStatus: "draft",
  subjectsIds: [],
  summaryImage: {
    useImage: false,
  },
  tagsIds: [],
  translations: [],
  type: "blog",
};

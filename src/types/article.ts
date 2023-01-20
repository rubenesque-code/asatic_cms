import { ArticleLikeEntity } from "./article-like-entity";

export type Article = ArticleLikeEntity<"article">;

/* const a: Article = {
  authorsIds: [],
  collectionsIds: [],
  id: "",
  lastSave: null,
  publishStatus: "draft",
  subjectsIds: [],
  summaryImage: {
    imageId: "",
    useImage: true,
    vertPosition: 50,
  },
  tagsIds: [],
  translations: [
    {
      body: [
        {
          type: "image",
          image: { imageId: null, vertPosition: 50 },
          id: "",
          index: 0,
        },
      ],
      id: "",
      languageId: "",
      summary: "",
      title: "",
    },
  ],
  type: "article",
  publishDate: null,
};
 */

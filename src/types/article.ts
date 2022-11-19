import { ArticleLikeEntity } from "./article-like-entity";

export type Article = ArticleLikeEntity<"article">;

/*
 const article: Article = {
  authorsIds: [],
  collectionsIds: [],
  id: "",
  landingCustomSectionImage: {
    aspectRatio: 16 / 9, // ?
    vertPosition: 50, // ?
  },
  lastSave: new Date(),
  publishStatus: "draft",
  subjectsIds: [],
  summaryImage: {
    imageId: "", // ?
    useImage: true, // ?
    vertPosition: 50, //  ?
  },
  tagsIds: [],
  translations: [
    {
      body: [],
      id: "",
      languageId: "",
      summary: {
        collection: "", // ?
        general: "", // ?
        landingCustomSection: "", // ?
      },
      title: '' // ?
    },
  ],
  type: "article",
  publishDate: new Date(), // ?
};
 */

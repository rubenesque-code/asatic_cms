import { default_language_Id } from "^constants/data";
import { Article } from "^types/article";

export const createNewArticle = ({
  id,
  translationId,
}: {
  id: string;
  translationId: string;
}): Article => ({
  id,
  publishInfo: {
    status: "draft",
  },
  authorIds: [],
  subjectIds: [],
  tagIds: [],
  translations: [
    {
      id: translationId,
      languageId: default_language_Id,
      body: [],
      landingPage: {},
    },
  ],
  type: "article",
  summaryImage: {
    useImage: true,
    style: {
      vertPosition: 50,
      aspectRatio: 16 / 9,
    },
  },
});

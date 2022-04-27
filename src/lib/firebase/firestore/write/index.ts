import { writeBatch, WriteBatch } from "@firebase/firestore/lite";

import { firestore } from "^lib/firebase/init";
import { getDocRef } from "../getRefs";

import { Article } from "^types/article";

const batchSetArticles = (batch: WriteBatch, data: Article[]) => {
  for (let i = 0; i < data.length; i++) {
    const article = data[i];
    const docRef = getDocRef("ARTICLES", article.id);

    batch.set(docRef, article);
  }
  // batch.set(docRef, data);
};

export const batchWriteArticlesPage = async ({
  articles,
}: {
  articles: {
    deleted: string[];
    newAndUpdated: Article[];
  };
}) => {
  const batch = writeBatch(firestore);

  for (let i = 0; i < articles.deleted.length; i++) {
    const articleId = articles.deleted[i];
    const docRef = getDocRef("ARTICLES", articleId);
    batch.delete(docRef);
  }

  batchSetArticles(batch, articles.newAndUpdated);

  await batch.commit();

  /**
    for (let i = 0; i < articles.newAndUpdated.length; i++) {
      const article = articles.newAndUpdated[i];
      batchSetArticle(batch, article);
    }
*/
};

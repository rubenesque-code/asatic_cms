import { writeBatch, WriteBatch } from "@firebase/firestore/lite";

import { firestore } from "^lib/firebase/init";
import { getDocRef } from "../getRefs";

import { Article } from "^types/article";
import { Author } from "^types/author";

const batchSetArticle = (batch: WriteBatch, article: Article) => {
  const docRef = getDocRef("ARTICLES", article.id);
  batch.set(docRef, article);
};

const batchDeleteArticle = (batch: WriteBatch, articleId: string) => {
  const docRef = getDocRef("ARTICLES", articleId);
  batch.delete(docRef);
};

const batchWriteArticles = (
  batch: WriteBatch,
  articles: {
    deleted: string[];
    newAndUpdated: Article[];
  }
) => {
  for (let i = 0; i < articles.newAndUpdated.length; i++) {
    const article = articles.newAndUpdated[i];
    batchSetArticle(batch, article);
  }

  for (let i = 0; i < articles.deleted.length; i++) {
    const articleId = articles.deleted[i];
    batchDeleteArticle(batch, articleId);
  }
};

const batchSetAuthors = (batch: WriteBatch, data: Author[]) => {
  for (let i = 0; i < data.length; i++) {
    const article = data[i];
    const docRef = getDocRef("AUTHORS", article.id);

    batch.set(docRef, article);
  }
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

  batchWriteArticles(batch, articles);

  await batch.commit();
};

export const batchWriteArticlePage = async ({
  article,
  authors,
}: {
  article: Article;
  authors: {
    newAndUpdated: Author[];
  };
}) => {
  const batch = writeBatch(firestore);

  batchSetArticle(batch, article);

  batchSetAuthors(batch, authors.newAndUpdated);

  await batch.commit();
};

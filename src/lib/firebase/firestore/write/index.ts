import { setDoc, writeBatch, WriteBatch } from "@firebase/firestore/lite";

import { firestore } from "^lib/firebase/init";
import { getDocRef } from "^lib/firebase/firestore/getRefs";

import { Article } from "^types/article";
import { Author } from "^types/author";
import { Image } from "^types/image";
import { Tag } from "^types/tag";

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

const batchSetAuthor = (batch: WriteBatch, author: Author) => {
  const docRef = getDocRef("AUTHORS", author.id);
  batch.set(docRef, author);
};

const batchDeleteAuthor = (batch: WriteBatch, authorId: string) => {
  const docRef = getDocRef("AUTHORS", authorId);
  batch.delete(docRef);
};

const batchWriteAuthors = (
  batch: WriteBatch,
  authors: {
    deleted: string[];
    newAndUpdated: Author[];
  }
) => {
  for (let i = 0; i < authors.newAndUpdated.length; i++) {
    const author = authors.newAndUpdated[i];
    batchSetAuthor(batch, author);
  }

  for (let i = 0; i < authors.deleted.length; i++) {
    const authorId = authors.deleted[i];
    batchDeleteAuthor(batch, authorId);
  }
};

const batchSetTag = (batch: WriteBatch, tag: Tag) => {
  const docRef = getDocRef("TAGS", tag.id);
  batch.set(docRef, tag);
};

const batchDeleteTag = (batch: WriteBatch, tagId: string) => {
  const docRef = getDocRef("TAGS", tagId);
  batch.delete(docRef);
};

const batchWriteTags = (
  batch: WriteBatch,
  tags: {
    deleted: string[];
    newAndUpdated: Tag[];
  }
) => {
  for (let i = 0; i < tags.newAndUpdated.length; i++) {
    const tag = tags.newAndUpdated[i];
    batchSetTag(batch, tag);
  }

  for (let i = 0; i < tags.deleted.length; i++) {
    const tagId = tags.deleted[i];
    batchDeleteTag(batch, tagId);
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
  tags,
}: {
  article: Article;
  authors: {
    deleted: string[];
    newAndUpdated: Author[];
  };
  tags: {
    deleted: string[];
    newAndUpdated: Tag[];
  };
}) => {
  const batch = writeBatch(firestore);

  batchSetArticle(batch, article);

  batchWriteAuthors(batch, authors);

  batchWriteTags(batch, tags);

  await batch.commit();
};

export const writeImage = async (image: Image) => {
  const docRef = getDocRef("IMAGES", image.id);
  await setDoc(docRef, image);
};

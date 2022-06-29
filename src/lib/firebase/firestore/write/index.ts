import {
  setDoc,
  writeBatch,
  WriteBatch,
  deleteDoc,
} from "@firebase/firestore/lite";

import { firestore } from "^lib/firebase/init";
import { getDocRef } from "^lib/firebase/firestore/getRefs";

import { Collection } from "../collectionKeys";

import { Article } from "^types/article";
import { Author } from "^types/author";
import { Image } from "^types/image";
import { Tag } from "^types/tag";
import { Language } from "^types/language";

const batchSetArticle = (batch: WriteBatch, article: Article) => {
  const docRef = getDocRef(Collection.ARTICLES, article.id);
  batch.set(docRef, article);
};

const batchDeleteArticle = (batch: WriteBatch, articleId: string) => {
  const docRef = getDocRef(Collection.ARTICLES, articleId);
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
  const docRef = getDocRef(Collection.AUTHORS, author.id);
  batch.set(docRef, author);
};

const batchDeleteAuthor = (batch: WriteBatch, authorId: string) => {
  const docRef = getDocRef(Collection.AUTHORS, authorId);
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
  const docRef = getDocRef(Collection.TAGS, tag.id);
  batch.set(docRef, tag);
};

const batchDeleteTag = (batch: WriteBatch, tagId: string) => {
  const docRef = getDocRef(Collection.TAGS, tagId);
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

export const deleteArticle = async (id: string) => {
  const docRef = getDocRef(Collection.ARTICLES, id);
  await deleteDoc(docRef);
};

const batchSetLanguage = (batch: WriteBatch, language: Language) => {
  const docRef = getDocRef(Collection.LANGUAGES, language.id);
  batch.set(docRef, language);
};

const batchDeleteLanguage = (batch: WriteBatch, languageId: string) => {
  const docRef = getDocRef(Collection.LANGUAGES, languageId);
  batch.delete(docRef);
};

const batchWriteLanguages = (
  batch: WriteBatch,
  languages: {
    deleted: string[];
    newAndUpdated: Language[];
  }
) => {
  for (let i = 0; i < languages.newAndUpdated.length; i++) {
    const language = languages.newAndUpdated[i];
    batchSetLanguage(batch, language);
  }

  for (let i = 0; i < languages.deleted.length; i++) {
    const languageId = languages.deleted[i];
    batchDeleteLanguage(batch, languageId);
  }
};

const batchSetImage = (batch: WriteBatch, image: Image) => {
  const docRef = getDocRef(Collection.IMAGES, image.id);
  batch.set(docRef, image);
};

const batchWriteImages = (batch: WriteBatch, images: Image[]) => {
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    batchSetImage(batch, image);
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

// * images can be uploaded from this page and through a matcher are added to the store - don't need to account for 'new' images. Can't be deleted. 'articleRelations' can be edited.
export const batchWriteArticlePage = async ({
  article,
  authors,
  images,
  languages,
  tags,
}: {
  article: Article;
  authors: {
    deleted: string[];
    newAndUpdated: Author[];
  };
  images: {
    newAndUpdated: Image[];
  };
  languages: {
    deleted: string[];
    newAndUpdated: Language[];
  };
  tags: {
    deleted: string[];
    newAndUpdated: Tag[];
  };
}) => {
  const batch = writeBatch(firestore);

  batchSetArticle(batch, article);

  batchWriteAuthors(batch, authors);

  batchWriteImages(batch, images.newAndUpdated);

  batchWriteLanguages(batch, languages);

  batchWriteTags(batch, tags);

  await batch.commit();
};

export const writeImage = async (image: Image) => {
  const docRef = getDocRef(Collection.IMAGES, image.id);
  await setDoc(docRef, image);
};

export const deleteImage = async (id: string) => {
  const docRef = getDocRef(Collection.IMAGES, id);
  await deleteDoc(docRef);
};

export const batchWriteImagesPage = async (images: Image[]) => {
  const batch = writeBatch(firestore);

  batchWriteImages(batch, images);

  await batch.commit();
};

export const batchWriteAuthorsPage = async ({
  articles,
  authors,
  languages,
}: {
  articles: {
    deleted: string[];
    newAndUpdated: Article[];
  };
  authors: {
    deleted: string[];
    newAndUpdated: Author[];
  };
  languages: {
    deleted: string[];
    newAndUpdated: Language[];
  };
}) => {
  const batch = writeBatch(firestore);

  batchWriteArticles(batch, articles);

  batchWriteAuthors(batch, authors);

  batchWriteLanguages(batch, languages);

  await batch.commit();
};

export const batchWriteLanguagesPage = async ({
  languages,
}: {
  languages: {
    deleted: string[];
    newAndUpdated: Language[];
  };
}) => {
  const batch = writeBatch(firestore);

  batchWriteLanguages(batch, languages);

  await batch.commit();
};

export const batchWriteTagsPage = async ({
  tags,
}: {
  tags: {
    deleted: string[];
    newAndUpdated: Tag[];
  };
}) => {
  const batch = writeBatch(firestore);

  batchWriteTags(batch, tags);

  await batch.commit();
};

export const batchWriteLandingPage = async ({
  articles,
  images,
}: {
  articles: {
    deleted: string[];
    newAndUpdated: Article[];
  };
  images: {
    newAndUpdated: Image[];
  };
}) => {
  const batch = writeBatch(firestore);

  batchWriteArticles(batch, articles);

  batchWriteImages(batch, images.newAndUpdated);

  await batch.commit();
};

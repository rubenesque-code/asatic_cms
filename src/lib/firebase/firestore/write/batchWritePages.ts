import { writeBatch } from "@firebase/firestore/lite";

import { firestore } from "^lib/firebase/init";

import { Article } from "^types/article";
import { Author } from "^types/author";
import { Image } from "^types/image";
import { Tag } from "^types/tag";
import { Language } from "^types/language";
import { LandingSection } from "^types/landing";
import {
  batchSetArticle,
  batchWriteArticles,
  batchWriteAuthors,
  batchWriteImages,
  batchWriteLanding,
  batchWriteLanguages,
  batchWriteTags,
  batchWriteSubjects,
} from "./batchWriteData";
import { Subject } from "^types/subject";

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
  subjects,
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
  subjects: {
    deleted: string[];
    newAndUpdated: Subject[];
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

  batchWriteSubjects(batch, subjects);

  batchWriteTags(batch, tags);

  await batch.commit();
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
  landingSections,
}: {
  articles: {
    deleted: string[];
    newAndUpdated: Article[];
  };
  images: {
    newAndUpdated: Image[];
  };
  landingSections: {
    deleted: string[];
    newAndUpdated: LandingSection[];
  };
}) => {
  const batch = writeBatch(firestore);

  batchWriteArticles(batch, articles);

  batchWriteImages(batch, images.newAndUpdated);

  batchWriteLanding(batch, landingSections);

  await batch.commit();
};

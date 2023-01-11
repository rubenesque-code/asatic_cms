import { writeBatch } from "@firebase/firestore/lite";

import { firestore } from "^lib/firebase/init";

import { Article } from "^types/article";
import { Author } from "^types/author";
import { Image } from "^types/image";
import { Tag } from "^types/tag";
import { Language } from "^types/language";
import { LandingCustomSectionComponent } from "^types/landing";
import {
  batchSetArticle,
  batchWriteArticles,
  batchWriteAuthors,
  batchSetImages,
  batchWriteLandingComponents,
  batchWriteLanguages,
  batchWriteTags,
  batchWriteSubjects,
  batchWriteCollections,
  batchSetRecordedEvent,
  batchSetBlog,
  batchSetCollection,
  batchWriteBlogs,
  batchWriteRecordedEvents,
  batchWriteRecordedEventTypes,
  batchSetSubject,
} from "./batchWriteData";
import { Subject } from "^types/subject";
import { Collection } from "^types/collection";
import { RecordedEvent } from "^types/recordedEvent";
import { RecordedEventType } from "^types/recordedEventType";
import { Blog } from "^types/blog";

// todo: can't delete anything from primary content, e.g. article/(s), pages

export const batchWriteCollectionPage = async ({
  articles,
  blogs,
  collection,
  images,
  languages,
  recordedEvents,
  subjects,
  tags,
}: {
  articles: {
    deleted: string[];
    newAndUpdated: Article[];
  };
  blogs: { deleted: string[]; newAndUpdated: Blog[] };
  collection: Collection;
  images: {
    newAndUpdated: Image[];
  };
  languages: {
    deleted: string[];
    newAndUpdated: Language[];
  };
  recordedEvents: {
    deleted: string[];
    newAndUpdated: RecordedEvent[];
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

  batchWriteArticles(batch, articles);

  batchWriteBlogs(batch, blogs);

  batchSetCollection(batch, collection);

  batchSetImages(batch, images.newAndUpdated);

  batchWriteLanguages(batch, languages);

  batchWriteRecordedEvents(batch, recordedEvents);

  batchWriteSubjects(batch, subjects);

  batchWriteTags(batch, tags);

  await batch.commit();
};

export const batchWriteSubjectPage = async ({
  articles,
  blogs,
  collections,
  images,
  languages,
  recordedEvents,
  subject,
  tags,
}: {
  subject: Subject;
  articles: {
    deleted: string[];
    newAndUpdated: Article[];
  };
  blogs: { deleted: string[]; newAndUpdated: Blog[] };
  collections: { deleted: string[]; newAndUpdated: Collection[] };
  images: {
    newAndUpdated: Image[];
  };
  languages: {
    deleted: string[];
    newAndUpdated: Language[];
  };
  recordedEvents: {
    deleted: string[];
    newAndUpdated: RecordedEvent[];
  };
  tags: {
    deleted: string[];
    newAndUpdated: Tag[];
  };
}) => {
  const batch = writeBatch(firestore);

  batchWriteArticles(batch, articles);

  batchWriteBlogs(batch, blogs);

  batchWriteCollections(batch, collections);

  batchSetImages(batch, images.newAndUpdated);

  batchWriteLanguages(batch, languages);

  batchWriteRecordedEvents(batch, recordedEvents);

  batchSetSubject(batch, subject);

  batchWriteTags(batch, tags);

  await batch.commit();
};

// * images can be uploaded from this page and through a matcher are added to the store - don't need to account for 'new' images. Can't be deleted. 'articleRelations' can be edited.
export const batchWriteArticlePage = async ({
  article,
  authors,
  collections,
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
  collections: {
    deleted: string[];
    newAndUpdated: Collection[];
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

  batchWriteCollections(batch, collections);

  batchSetImages(batch, images.newAndUpdated);

  batchWriteLanguages(batch, languages);

  batchWriteSubjects(batch, subjects);

  batchWriteTags(batch, tags);

  await batch.commit();
};

export const batchWriteBlogPage = async ({
  authors,
  blog,
  collections,
  images,
  languages,
  subjects,
  tags,
}: {
  authors: {
    deleted: string[];
    newAndUpdated: Author[];
  };
  blog: Blog;
  collections: {
    deleted: string[];
    newAndUpdated: Collection[];
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

  batchSetBlog(batch, blog);

  batchWriteAuthors(batch, authors);

  batchWriteCollections(batch, collections);

  batchSetImages(batch, images.newAndUpdated);

  batchWriteLanguages(batch, languages);

  batchWriteSubjects(batch, subjects);

  batchWriteTags(batch, tags);

  await batch.commit();
};

export const batchWriteRecordedEventPage = async ({
  recordedEvent,
  authors,
  collections,
  languages,
  recordedEventTypes,
  subjects,
  tags,
}: {
  recordedEvent: RecordedEvent;
  authors: {
    deleted: string[];
    newAndUpdated: Author[];
  };
  collections: {
    deleted: string[];
    newAndUpdated: Collection[];
  };
  languages: {
    deleted: string[];
    newAndUpdated: Language[];
  };
  recordedEventTypes: {
    deleted: string[];
    newAndUpdated: RecordedEventType[];
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

  batchSetRecordedEvent(batch, recordedEvent);

  batchWriteAuthors(batch, authors);

  batchWriteCollections(batch, collections);

  batchWriteLanguages(batch, languages);

  batchWriteRecordedEventTypes(batch, recordedEventTypes);

  batchWriteSubjects(batch, subjects);

  batchWriteTags(batch, tags);

  await batch.commit();
};

export const batchWriteImagesPage = async (images: Image[]) => {
  const batch = writeBatch(firestore);

  batchSetImages(batch, images);

  await batch.commit();
};

// languages created in this page are written to db and added to store via builder.matcher.
export const batchWriteAuthorsPage = async ({
  authors,
  articles,
  blogs,
  recordedEvents,
}: {
  authors: {
    newAndUpdated: Author[];
    deleted: string[];
  };
  articles: { updated: Article[] };
  blogs: { updated: Blog[] };
  recordedEvents: { updated: RecordedEvent[] };
}) => {
  const batch = writeBatch(firestore);

  batchWriteAuthors(batch, authors);

  articles.updated.forEach((article) => {
    batchSetArticle(batch, article);
  });

  blogs.updated.forEach((blog) => {
    batchSetBlog(batch, blog);
  });

  recordedEvents.updated.forEach((recordedEvent) => {
    batchSetRecordedEvent(batch, recordedEvent);
  });

  await batch.commit();
};

export const batchWriteTagsPage = async ({
  tags,
  articles,
  blogs,
  collections,
  recordedEvents,
  subjects,
}: {
  tags: {
    newAndUpdated: Tag[];
    deleted: string[];
  };
  articles: { updated: Article[] };
  blogs: { updated: Blog[] };
  collections: { updated: Collection[] };
  recordedEvents: { updated: RecordedEvent[] };
  subjects: { updated: Subject[] };
}) => {
  const batch = writeBatch(firestore);

  batchWriteTags(batch, tags);

  articles.updated.forEach((article) => {
    batchSetArticle(batch, article);
  });

  blogs.updated.forEach((blog) => {
    batchSetBlog(batch, blog);
  });

  collections.updated.forEach((collection) => {
    batchSetCollection(batch, collection);
  });

  recordedEvents.updated.forEach((recordedEvent) => {
    batchSetRecordedEvent(batch, recordedEvent);
  });

  subjects.updated.forEach((subject) => {
    batchSetSubject(batch, subject);
  });

  await batch.commit();
};

export const batchWriteLandingPage = async ({
  articles,
  blogs,
  collections,
  recordedEvents,
  images,
  landingComponents,
}: {
  articles: {
    deleted: string[];
    newAndUpdated: Article[];
  };
  blogs: {
    deleted: string[];
    newAndUpdated: Blog[];
  };
  collections: {
    deleted: string[];
    newAndUpdated: Collection[];
  };
  recordedEvents: {
    deleted: string[];
    newAndUpdated: RecordedEvent[];
  };
  images: Image[];
  landingComponents: {
    deleted: string[];
    newAndUpdated: LandingCustomSectionComponent[];
  };
}) => {
  const batch = writeBatch(firestore);

  batchWriteArticles(batch, articles);

  batchWriteBlogs(batch, blogs);

  batchWriteCollections(batch, collections);

  batchWriteRecordedEvents(batch, recordedEvents);

  batchSetImages(batch, images);

  batchWriteLandingComponents(batch, landingComponents);

  await batch.commit();
};

export const batchWriteRecordedEventTypesPage = async ({
  recordedEventTypes,
  recordedEvents,
}: {
  recordedEventTypes: {
    deleted: string[];
    newAndUpdated: RecordedEventType[];
  };
  recordedEvents: {
    updated: RecordedEvent[];
  };
}) => {
  const batch = writeBatch(firestore);

  batchWriteRecordedEventTypes(batch, recordedEventTypes);

  recordedEvents.updated.forEach((recordedEvent) => {
    batchSetRecordedEvent(batch, recordedEvent);
  });

  await batch.commit();
};

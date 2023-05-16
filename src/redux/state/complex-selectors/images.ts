import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectArticles } from "../articles";
import { selectBlogs } from "../blogs";
import { selectCollections } from "../collections";
import { selectRecordedEvents } from "../recordedEvents";

export const selectUsedImagesIds = createSelector(
  [(state: RootState) => state],
  (state) => {
    const articles = selectArticles(state);
    const blogs = selectBlogs(state);
    const collections = selectCollections(state);
    const recordedEvents = selectRecordedEvents(state);

    const articleLandingImages = articles.flatMap((a) =>
      a.summaryImage.imageId ? [a.summaryImage.imageId] : []
    );
    const articleBodyImages = articles
      .flatMap((article) => article.translations)
      .flatMap((t) => t.body)
      .flatMap((s) => (s?.type === "image" ? [s] : []))
      .flatMap((s) => (s.image.imageId ? [s.image.imageId] : []));
    const articleImages = new Set([
      ...articleLandingImages,
      ...articleBodyImages,
    ]);

    const blogLandingImages = blogs.flatMap((b) =>
      b.summaryImage?.imageId ? [b.summaryImage.imageId] : []
    );
    const blogBodyImages = blogs
      .flatMap((blog) => blog.translations)
      .flatMap((t) => t.body)
      .flatMap((s) => (s?.type === "image" ? [s] : []))
      .flatMap((s) => (s.image.imageId ? [s.image.imageId] : []));
    const blogImages = new Set([...blogLandingImages, ...blogBodyImages]);

    const collectionImages = collections.flatMap((c) => {
      const bannerImage = c.bannerImage.imageId;
      const summaryImage = c.summaryImage.imageId;

      return [bannerImage, summaryImage].flatMap((id) => (id ? [id] : []));
    });

    const recordedEventImages = recordedEvents.flatMap((r) =>
      r.summaryImage.imageId ? [r.summaryImage.imageId] : []
    );

    const usedImagesIds = Array.from(
      new Set([
        ...articleImages,
        ...blogImages,
        ...collectionImages,
        ...recordedEventImages,
      ])
    );

    return usedImagesIds;
  }
);

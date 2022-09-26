import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "^redux/store";
import { selectArticles } from "../articles";
import { selectBlogs } from "../blogs";
import { selectCollections } from "../collections";
import { selectRecordedEvents } from "../recordedEvents";

export const selectUsedImagesIds = createSelector(
  [(state: RootState) => state],
  (state) => {
    // const images = selectImages(state)
    const articles = selectArticles(state);
    const blogs = selectBlogs(state);
    const collections = selectCollections(state);
    const recordedEvents = selectRecordedEvents(state);

    const articleLandingImages = articles.flatMap((a) =>
      a.landingImage.imageId ? [a.landingImage.imageId] : []
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
      b.landingImage?.imageId ? [b.landingImage.imageId] : []
    );
    const blogBodyImages = blogs
      .flatMap((blog) => blog.translations)
      .flatMap((t) => t.body)
      .flatMap((s) => (s?.type === "image" ? [s] : []))
      .flatMap((s) => (s.image.imageId ? [s.image.imageId] : []));
    const blogImages = new Set([...blogLandingImages, ...blogBodyImages]);

    const collectionImages = collections.flatMap((c) =>
      c.image.id ? [c.image.id] : []
    );

    const recordedEventImages = recordedEvents.flatMap((r) =>
      r.landingImage.imageId ? [r.landingImage.imageId] : []
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

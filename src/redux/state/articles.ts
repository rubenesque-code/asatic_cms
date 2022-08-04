import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/core";
import { createNewArticle } from "src/data/createDocument";
import { v4 as generateUId } from "uuid";

import { orderSortableComponents2 } from "^helpers/general";

import { articlesApi } from "^redux/services/articles";
import { RootState } from "^redux/store";

import {
  Article,
  ArticleTranslation,
  ArticleTranslationBodySection,
  ArticleTranslationBodyVideoSection,
} from "^types/article";

const articleAdapter = createEntityAdapter<Article>();
const initialState = articleAdapter.getInitialState();

// todo: could have undefined for many of article fields? (so whe)
// type EntityPayloadAction<T = void> = PayloadAction<T & { id: string }>;
// * below is hacky - duplicates id: string as a property.
type EntityPayloadAction<T = { id: string }> = PayloadAction<
  T & { id: string }
>;

const findTranslation = (entity: Article, translationId: string) => {
  const translations = entity.translations;
  const translation = translations.find((t) => t.id === translationId);

  return translation;
};
const findBodySection = (
  translation: ArticleTranslation,
  sectionId: string
) => {
  const bodySections = translation.body;
  const section = bodySections.find((s) => s.id === sectionId);

  return section;
};

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Article;
      }>
    ) {
      const { data } = action.payload;
      articleAdapter.setOne(state, data);
    },
    overWriteAll(
      state,
      action: PayloadAction<{
        data: Article[];
      }>
    ) {
      const { data } = action.payload;
      articleAdapter.setAll(state, data);
    },
    addOne(state) {
      const newArticle = createNewArticle({
        id: generateUId(),
        translationId: generateUId(),
      });
      articleAdapter.addOne(state, newArticle);
    },
    removeOne(state, action: EntityPayloadAction) {
      const { id } = action.payload;

      articleAdapter.removeOne(state, id);
    },
    updatePublishDate(
      state,
      action: EntityPayloadAction<{
        date: Date;
      }>
    ) {
      const { id, date } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.publishInfo.date = date;
      }
    },
    togglePublishStatus(state, action: EntityPayloadAction) {
      const { id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const currentStatus = entity.publishInfo.status;
        entity.publishInfo.status =
          currentStatus === "draft" ? "published" : "draft";
      }
    },
    updateSaveDate(
      state,
      action: EntityPayloadAction<{
        date: Date;
      }>
    ) {
      const { id, date } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.lastSave = date;
      }
    },
    addTranslation(
      state,
      action: EntityPayloadAction<{
        languageId: string;
      }>
    ) {
      const { id, languageId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.translations.push({
          id: generateUId(),
          languageId,
          body: [],
          landingPage: {},
        });
      }
    },
    deleteTranslation(
      state,
      action: EntityPayloadAction<{
        translationId: string;
      }>
    ) {
      const { id, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const index = translations.findIndex((t) => t.id === translationId);

        translations.splice(index, 1);
      }
    },
    addAuthor(
      state,
      action: EntityPayloadAction<{
        authorId: string;
      }>
    ) {
      const { id, authorId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.authorIds.push(authorId);
      }
    },
    removeAuthor(
      state,
      action: EntityPayloadAction<{
        authorId: string;
      }>
    ) {
      const { id, authorId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const authorIds = entity.authorIds;
        const index = authorIds.findIndex((id) => id === authorId);

        authorIds.splice(index, 1);
      }
    },
    updateTitle(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        title: string;
      }>
    ) {
      const { id, title, translationId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const translation = translations.find((t) => t.id === translationId);
        if (translation) {
          translation.title = title;
        }
      }
    },
    addBodySection(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        type: ArticleTranslationBodySection["type"];
        index: number;
      }>
    ) {
      const { id, index, type, translationId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const translation = findTranslation(entity, translationId);
      if (!translation) {
        return;
      }

      const bodySections = orderSortableComponents2(translation.body);

      const sharedFields = {
        id: generateUId(),
        index,
      };

      if (type === "image") {
        const newSection = {
          ...sharedFields,
          type,
          image: {
            imageId: null,
            style: {
              vertPosition: 50,
              aspectRatio: 16 / 9,
            },
          },
        };

        bodySections.splice(index, 0, newSection);
      }
      if (type === "text") {
        const newSection = {
          ...sharedFields,
          type,
          content: null,
        };
        bodySections.splice(index, 0, newSection);
      }
      if (type === "video") {
        const newSection = {
          ...sharedFields,
          type,
        };
        bodySections.splice(index, 0, newSection);
      }

      for (let i = 0; i < bodySections.length; i++) {
        const section = bodySections[i];
        section.index = i;
      }
    },
    deleteBodySection(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        sectionId: string;
      }>
    ) {
      const { id, sectionId, translationId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const translation = findTranslation(entity, translationId);
      if (!translation) {
        return;
      }
      const bodySections = orderSortableComponents2(translation.body);

      const sectionIndex = bodySections.findIndex((s) => s.id === sectionId);
      bodySections.splice(sectionIndex, 1);

      for (let i = 0; i < bodySections.length; i++) {
        const section = bodySections[i];
        section.index = i;
      }
    },
    reorderBody(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        activeId: string;
        overId: string;
      }>
    ) {
      const { activeId, overId, translationId, id } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const translation = findTranslation(entity, translationId);
      if (!translation) {
        return;
      }
      const bodySections = orderSortableComponents2(translation.body);

      const activeSection = bodySections.find((s) => s.id === activeId)!;
      const overSection = bodySections.find((s) => s.id === overId)!;
      const activeIndex = activeSection.index;
      const overIndex = overSection.index;

      bodySections.splice(activeIndex, 1);
      bodySections.splice(overIndex, 0, activeSection);

      for (let i = 0; i < bodySections.length; i++) {
        const section = bodySections[i];
        section.index = i;
      }

      /*       const activeIndexIsIncreasing = activeIndex < overIndex;
      if (activeIndexIsIncreasing) {
        for (let i = activeIndex + 1; i <= overIndex; i++) {
          const section = bodySections[i];
          section.index = section.index - 1;
        }
      } else {
        for (let i = overIndex; i < activeIndex; i++) {
          const section = bodySections[i];
          section.index = section.index + 1;
        }
      }

      activeSection.index = overIndex; */
    },
    updateBodyTextContent(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        sectionId: string;
        content: JSONContent;
      }>
    ) {
      const { id, sectionId, translationId, content } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const translation = findTranslation(entity, translationId);
      if (!translation) {
        return;
      }
      const section = findBodySection(translation, sectionId);
      if (!section || section.type !== "text") {
        return;
      }
      section.content = content;
    },
    updateBodyImageSrc(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        sectionId: string;
        imageId: string;
      }>
    ) {
      const { id, sectionId, translationId, imageId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const translation = findTranslation(entity, translationId);
      if (!translation) {
        return;
      }
      const bodySections = translation.body;
      const section = bodySections.find((s) => s.id === sectionId);
      if (!section || section.type !== "image") {
        return;
      }
      section.image = {
        ...section.image,
        imageId,
      };
    },
    updateBodyImageAspectRatio(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        sectionId: string;
        aspectRatio: number;
      }>
    ) {
      const { id, sectionId, translationId, aspectRatio } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const translation = findTranslation(entity, translationId);
      if (!translation) {
        return;
      }
      const bodySections = translation.body;
      const section = bodySections.find((s) => s.id === sectionId);
      if (!section || section.type !== "image") {
        return;
      }
      const image = section.image;
      const style = image.style;

      section.image = {
        ...image,
        style: {
          ...style,
          aspectRatio,
        },
      };
    },
    updateBodyImageVertPosition(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        sectionId: string;
        vertPosition: number;
      }>
    ) {
      const { id, sectionId, translationId, vertPosition } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const translation = findTranslation(entity, translationId);
      if (!translation) {
        return;
      }
      const bodySections = translation.body;
      const section = bodySections.find((s) => s.id === sectionId);
      if (!section || section.type !== "image") {
        return;
      }
      const image = section.image;
      const style = image.style;

      section.image = {
        ...image,
        style: {
          ...style,
          vertPosition,
        },
      };
    },
    updateBodyImageCaption(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        sectionId: string;
        caption: string;
      }>
    ) {
      const { id, sectionId, translationId, caption } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const translation = findTranslation(entity, translationId);
      if (!translation) {
        return;
      }
      const section = findBodySection(translation, sectionId);
      if (!section || section.type !== "image") {
        return;
      }
      const image = section.image;

      section.image = {
        ...image,
        caption,
      };
    },
    updateBodyVideoSrc(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        sectionId: string;
        videoId: string;
      }>
    ) {
      const { id, sectionId, translationId, videoId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const translation = findTranslation(entity, translationId);
      if (!translation) {
        return;
      }
      const section = findBodySection(translation, sectionId);
      if (!section || section.type !== "video") {
        return;
      }

      const newData: ArticleTranslationBodyVideoSection["video"] = section.video
        ? { ...section.video, id: videoId }
        : { id: videoId, type: "youtube" };

      section.video = newData;
    },
    updateBodyVideoCaption(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        sectionId: string;
        caption: string;
      }>
    ) {
      const { id, sectionId, translationId, caption } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }
      const translation = findTranslation(entity, translationId);
      if (!translation) {
        return;
      }
      const section = findBodySection(translation, sectionId);
      if (!section || section.type !== "video") {
        return;
      }

      const newData: ArticleTranslationBodyVideoSection["video"] = section.video
        ? { ...section.video, caption }
        : { id: generateUId(), type: "youtube", caption };

      section.video = newData;
    },
    updateSummary(
      state,
      action: EntityPayloadAction<{
        translationId: string;
        summary: JSONContent;
        summaryType: "auto" | "custom";
      }>
    ) {
      const { id, summary, translationId, summaryType } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const translations = entity.translations;
        const translation = translations.find((t) => t.id === translationId);
        if (translation) {
          if (summaryType === "auto") {
            translation.landingPage.autoSummary = summary;
          } else {
            translation.landingPage.userSummary = summary;
          }
        }
      }
    },
    addTag(
      state,
      action: EntityPayloadAction<{
        tagId: string;
      }>
    ) {
      const { id, tagId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.tagIds.push(tagId);
      }
    },
    removeTag(
      state,
      action: EntityPayloadAction<{
        tagId: string;
      }>
    ) {
      const { id, tagId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const tagIds = entity.tagIds;
        const index = tagIds.findIndex((tId) => tId === tagId);
        tagIds.splice(index, 1);
      }
    },
    addSubject(
      state,
      action: EntityPayloadAction<{
        subjectId: string;
      }>
    ) {
      const { id, subjectId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.subjectIds.push(subjectId);
      }
    },
    removeSubject(
      state,
      action: EntityPayloadAction<{
        subjectId: string;
      }>
    ) {
      const { id, subjectId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const subjectIds = entity.subjectIds;
        const index = subjectIds.findIndex((tId) => tId === subjectId);
        subjectIds.splice(index, 1);
      }
    },
    addCollection(
      state,
      action: EntityPayloadAction<{
        collectionId: string;
      }>
    ) {
      const { id, collectionId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.collectionIds.push(collectionId);
      }
    },
    removeCollection(
      state,
      action: EntityPayloadAction<{
        collectionId: string;
      }>
    ) {
      const { id, collectionId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const collectionIds = entity.collectionIds;
        const index = collectionIds.findIndex((tId) => tId === collectionId);
        collectionIds.splice(index, 1);
      }
    },
    updateSummaryImageAspectRatio(
      state,
      action: EntityPayloadAction<{
        aspectRatio: number;
      }>
    ) {
      const { id, aspectRatio } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.summaryImage.style.aspectRatio = aspectRatio;
      }
    },
    updateSummaryImageVertPosition(
      state,
      action: EntityPayloadAction<{
        vertPosition: number;
      }>
    ) {
      const { id, vertPosition } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.summaryImage.style.vertPosition = vertPosition;
      }
    },
    updateSummaryImageSrc(
      state,
      action: EntityPayloadAction<{
        imgId: string;
      }>
    ) {
      const { id, imgId } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.summaryImage.imageId = imgId;
      }
    },
    toggleUseSummaryImage(state, action: EntityPayloadAction) {
      const { id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.summaryImage.useImage = !entity.summaryImage.useImage;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      articlesApi.endpoints.fetchArticles.matchFulfilled,
      (state, { payload }) => {
        articleAdapter.upsertMany(state, payload);
      }
    );
    builder.addMatcher(
      articlesApi.endpoints.createArticle.matchFulfilled,
      (state, { payload }) => {
        articleAdapter.addOne(state, payload.article);
      }
    );
    builder.addMatcher(
      articlesApi.endpoints.deleteArticle.matchFulfilled,
      (state, { payload }) => {
        articleAdapter.removeOne(state, payload.id);
      }
    );
  },
});

export default articleSlice.reducer;

export const {
  addCollection,
  removeCollection,
  overWriteOne,
  overWriteAll,
  removeOne,
  addOne,
  updatePublishDate,
  togglePublishStatus,
  addTranslation,
  deleteTranslation,
  addAuthor,
  removeAuthor,
  updateTitle,
  addTag,
  removeTag,
  addSubject,
  removeSubject,
  updateSaveDate,
  updateSummary,
  updateSummaryImageAspectRatio,
  updateSummaryImageVertPosition,
  updateSummaryImageSrc,
  toggleUseSummaryImage,
  addBodySection,
  deleteBodySection,
  reorderBody,
  updateBodyImageAspectRatio,
  updateBodyImageSrc,
  updateBodyImageVertPosition,
  updateBodyTextContent,
  updateBodyVideoSrc,
  updateBodyVideoCaption,
  updateBodyImageCaption,
} = articleSlice.actions;

export const { selectAll, selectById, selectTotal } =
  articleAdapter.getSelectors((state: RootState) => state.articles);
export const selectIds = (state: RootState) => state.articles.ids as string[];

export const selectEntitiesByIds = (state: RootState, ids: string[]) => {
  const entities = state.articles.entities;
  const selectedEntities = ids.map((id) => entities[id]);

  return selectedEntities;
};

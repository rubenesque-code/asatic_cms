import {
  ActionReducerMapBuilder,
  EntityState,
  nanoid,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";

import { default_language_Id } from "^constants/data";

import { sortComponents as sortComponents } from "^helpers/general";

import {
  ArticleLikeEntity,
  ArticleLikeTranslation,
} from "^types/article-like-entity";
import { TranslationPayloadGeneric } from "../types";

import createPrimaryContentGenericSlice from "./primaryContentGeneric";

export function findTranslation<
  TTranslation extends ArticleLikeTranslation,
  TEntity extends { id: string; translations: TTranslation[] }
>(entity: TEntity, translationId: string) {
  return entity.translations.find((t) => t.id === translationId);
}

export default function createArticleLikeContentGenericSlice<
  // TTranslation extends ArticleLikeTranslation,
  TEntity extends ArticleLikeEntity<"article" | "blog">,
  Reducers extends SliceCaseReducers<EntityState<TEntity>>
>({
  name = "",
  initialState,
  reducers,
  extraReducers,
}: {
  name: string;
  initialState: EntityState<TEntity>;
  reducers: ValidateSliceCaseReducers<EntityState<TEntity>, Reducers>;
  extraReducers: (
    builder: ActionReducerMapBuilder<EntityState<TEntity>>
  ) => void;
}) {
  return createPrimaryContentGenericSlice({
    name,
    initialState,
    reducers: {
      addTranslation(
        state,
        action: PayloadAction<{
          id: string;
          languageId?: string;
        }>
      ) {
        const { id, languageId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }

        entity.translations.push({
          body: [],
          id: nanoid(),
          languageId: languageId || default_language_Id,
          summary: {},
        });
      },
      updateTitle(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            title: string;
          }
        >
      ) {
        const { id, title, translationId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          const translation = findTranslation(entity, translationId);
          if (translation) {
            translation.title = title;
          }
        }
      },
      addBodySection(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionData: ArticleLikeTranslation["body"][number];
          }
        >
      ) {
        const { id, sectionData, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }

        const { body } = translation;
        sortComponents(body);

        body.splice(sectionData.index, 0, sectionData);

        for (let i = sectionData.index; i < body.length; i++) {
          const section = body[i];
          section.index = i;
        }
      },
      removeBodySection(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
          }
        >
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
        const { body } = translation;
        sortComponents(body);

        const sectionIndex = body.findIndex((s) => s.id === sectionId);
        body.splice(sectionIndex, 1);

        for (let i = 0; i < body.length; i++) {
          const section = body[i];
          section.index = i;
        }
      },
      moveSection(
        state,
        action: PayloadAction<{
          id: string;
          translationId: string;
          sectionId: string;
          direction: "up" | "down";
        }>
      ) {
        const { id, direction, sectionId, translationId } = action.payload;

        const entity = state.entities[id];
        if (!entity) {
          return;
        }

        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }

        // const { body } = translation;
        const body = sortComponents(translation.body);

        const activeSection = body.find((s) => s.id === sectionId);
        if (!activeSection) {
          return;
        }

        const activeIndex = activeSection.index;

        const swapWithIndex =
          direction === "down" ? activeIndex + 1 : activeIndex - 1;
        const swapWithSection = body[swapWithIndex];

        if (!swapWithSection) {
          return;
        }

        activeSection.index = swapWithIndex;
        swapWithSection.index = activeIndex;
      },
      updateBodyImageSrc(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            imageId: string;
          }
        >
      ) {
        const { id, imageId, sectionId, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "image") {
          return;
        }
        section.image.imageId = imageId;
      },
      updateBodyImageCaption(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            caption: string;
          }
        >
      ) {
        const { id, caption, sectionId, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "image") {
          return;
        }
        section.caption = caption;
      },
      updateBodyImageAspectRatio(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            aspectRatio: number;
          }
        >
      ) {
        const { id, aspectRatio, sectionId, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "image") {
          return;
        }
        section.image.aspectRatio = aspectRatio;
      },
      updateBodyImageVertPosition(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            vertPosition: number;
          }
        >
      ) {
        const { id, vertPosition, sectionId, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "image") {
          return;
        }
        section.image.vertPosition = vertPosition;
      },
      updateBodyText(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            text: string;
          }
        >
      ) {
        const { id, text, sectionId, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "text") {
          return;
        }
        section.text = text;
      },
      updateBodyVideoSrc(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            youtubeId: string;
          }
        >
      ) {
        const { id, youtubeId, sectionId, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "video") {
          return;
        }
        section.youtubeId = youtubeId;
      },
      updateBodyVideoCaption(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            caption: string;
          }
        >
      ) {
        const { id, caption, sectionId, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "video") {
          return;
        }
        section.caption = caption;
      },
      updateLandingAutoSummary(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            summary: string;
          }
        >
      ) {
        const { id, summary, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        translation.summary.general = summary;
      },
      updateCollectionSummary(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            summary: string;
          }
        >
      ) {
        const { id, summary, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        translation.summary.collection = summary;
      },
      updateLandingCustomSummary(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            summary: string;
          }
        >
      ) {
        const { id, summary, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = entity.translations.find(
          (t) => t.id === translationId
        );
        if (!translation) {
          return;
        }
        translation.summary.landingCustomSection = summary;
      },
      toggleUseSummaryImage(
        state,
        action: PayloadAction<{
          id: string;
        }>
      ) {
        const { id } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.summaryImage.useImage = !entity.summaryImage.useImage;
        }
      },
      updateSummaryImageSrc(
        state,
        action: PayloadAction<{
          id: string;
          imageId: string;
        }>
      ) {
        const { id, imageId } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.summaryImage.imageId = imageId;
        }
      },
      updateSummaryImageVertPosition(
        state,
        action: PayloadAction<{
          id: string;
          vertPosition: number;
        }>
      ) {
        const { id, vertPosition } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.summaryImage.vertPosition = vertPosition;
        }
      },
      ...reducers,
    },
    extraReducers,
  });
}

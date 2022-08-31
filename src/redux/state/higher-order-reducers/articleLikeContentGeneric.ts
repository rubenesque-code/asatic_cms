import {
  ActionReducerMapBuilder,
  EntityState,
  PayloadAction,
  SliceCaseReducers,
  ValidateSliceCaseReducers,
} from "@reduxjs/toolkit";
import { JSONContent } from "@tiptap/core";

import { sortComponents as sortComponents } from "^helpers/general";

import {
  SecondaryContentFields,
  TranslationGeneric,
} from "^types/display-content";
import { ArticleLikeTranslation } from "^types/article-like-content";
import { TranslationPayloadGeneric } from "../types";

import createPrimaryContentGenericSlice, {
  PrimaryEntity,
} from "./primaryContentGeneric";

export function findTranslation<
  TTranslation extends TranslationGeneric & ArticleLikeTranslation,
  TEntity extends { id: string; translations: TTranslation[] }
>(entity: TEntity, translationId: string) {
  return entity.translations.find((t) => t.id === translationId);
}

// todo: using prepare within reducers of higher order createSlice doesn't work? see addBodySection

export type ArticleLikeEntity<
  TTranslation extends TranslationGeneric & ArticleLikeTranslation
> = PrimaryEntity<TTranslation> & SecondaryContentFields;

export default function createArticleLikeContentGenericSlice<
  TTranslation extends TranslationGeneric & ArticleLikeTranslation,
  TEntity extends ArticleLikeEntity<TTranslation>,
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
        // const bodyOrdered = sortComponents(translation.body);
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
      reorderBody(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            activeId: string;
            overId: string;
          }
        >
      ) {
        const { activeId, id, overId, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }

        const { body } = translation;
        // sortComponents(body);
        body.sort((a, b) => a.index - b.index);

        const activeIndex = body.findIndex(
          (section) => section.id === activeId
        )!;
        const overIndex = body.findIndex((section) => section.id === overId)!;

        if (activeIndex > overIndex) {
          for (let i = overIndex; i < activeIndex; i++) {
            const section = body[i];
            section.index = section.index + 1;
          }
        } else if (activeIndex < overIndex) {
          for (let i = activeIndex + 1; i <= overIndex; i++) {
            const section = body[i];
            section.index = section.index - 1;
          }
        }
        const activeSection = body.find((section) => section.id === activeId)!;
        activeSection.index = overIndex;
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
        section.image.caption = caption;
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
        section.image.style.aspectRatio = aspectRatio;
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
        section.image.style.vertPosition = vertPosition;
      },
      updateBodyText(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            text: JSONContent;
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
        section.video.youtubeId = youtubeId;
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
        section.video.caption = caption;
      },
      updateLandingAutoSummary(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            summary: JSONContent;
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
        translation.landingAutoSummary = summary;
      },
      updateCollectionSummary(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            summary: JSONContent;
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
        translation.collectionSummary = summary;
      },

      ...reducers,
    },
    extraReducers,
  });
}

// export { createDisplayContentGenericSlice as createDisplayContentGenericeSlice };

/*       addBodySection: {
        reducer(
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

          translation.body.splice(sectionData.index, 0, sectionData);
        },
        prepare(
          payload: TranslationPayloadGeneric & {
            index: number;
            type: TranslationSection;
          }
        ) {
          const { index, type, ...payloadArgs } = payload;
          const createSectionArgs = { id: nanoid(), index };
          return {
            payload: {
              sectionData:
                type === "image"
                  ? createArticleLikeImageSection(createSectionArgs)
                  : type === "text"
                  ? createArticleLikeTextSection(createSectionArgs)
                  : createArticleLikeVideoSection(createSectionArgs),
              ...payloadArgs,
            },
          };
        },
      }, */

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
  ArticleLikeRelatedEntityUnion,
  ArticleLikeTranslation,
} from "^types/article-like-entity";
import { TranslationPayloadGeneric } from "../types";
import { relatedEntityFieldMap } from "../utilities/reducers";

import createDocumentEntityReducers from "./documentEntityReducers";

export function findTranslation<
  TTranslation extends ArticleLikeTranslation,
  TEntity extends { id: string; translations: TTranslation[] }
>(entity: TEntity, translationId: string) {
  return entity.translations.find((t) => t.id === translationId);
}

export default function createArticleLikeEntityReducers<
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
  return createDocumentEntityReducers({
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

        const translationsByContent = entity.translations.sort(
          (a, b) => a.body.length - b.body.length
        );
        const translationToCopy = translationsByContent[0];

        const newBody = translationToCopy.body.map((section) =>
          section.type === "image" || section.type === "video"
            ? { ...section, caption: "" }
            : section.type === "text"
            ? {
                ...section,
                text: "",
              }
            : {
                ...section,
                notes: "",
                title: "",
              }
        );

        entity.translations.push({
          body: newBody,
          id: nanoid(),
          languageId: languageId || default_language_Id,
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
      updateTableTitle(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            title: string;
          }
        >
      ) {
        const { id, title, sectionId, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "table") {
          return;
        }
        section.title = title;
      },
      updateTableNotes(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            notes: string;
          }
        >
      ) {
        const { id, notes, sectionId, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "table") {
          return;
        }
        section.notes = notes;
      },
      updateTableHeaderText(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            colIndex: number;
            text: string;
          }
        >
      ) {
        const { id, colIndex, text, sectionId, translationId } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "table") {
          return;
        }
        section.columns[colIndex].Header = text;
      },
      updateTableCellText(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            rowIndex: number;
            colAccessor: string;
            text: string;
          }
        >
      ) {
        const { id, colAccessor, rowIndex, text, sectionId, translationId } =
          action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "table") {
          return;
        }
        const row = section.rows[rowIndex];
        row[colAccessor] = text;
      },
      toggleTableCol1IsTitular(
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
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "table") {
          return;
        }
        section.col1IsTitular = !section.col1IsTitular;
      },
      addTableRow(
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
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "table") {
          return;
        }

        const newRowArr = section.columns.map((column) => [
          column.accessor,
          "",
        ]);
        const newRow = Object.fromEntries(newRowArr);
        section.rows.push(newRow);
      },
      deleteTableRow(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            rowIndex: number;
          }
        >
      ) {
        const { id, sectionId, translationId, rowIndex } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "table") {
          return;
        }

        section.rows.splice(rowIndex, 1);
      },
      addTableColumn(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            colNum: number;
          }
        >
      ) {
        const { id, sectionId, translationId, colNum } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "table") {
          return;
        }

        const newAccessor = `col${colNum}`;
        section.columns.push({ Header: "", accessor: newAccessor });

        const updatedRows = section.rows.map((row) => ({
          ...row,
          [newAccessor]: "",
        }));
        section.rows = updatedRows;
      },
      deleteTableColumn(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            colIndex: number;
          }
        >
      ) {
        const { id, sectionId, translationId, colIndex } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }
        const translation = findTranslation(entity, translationId);
        if (!translation) {
          return;
        }
        const section = translation.body.find((s) => s.id === sectionId);
        if (!section || section.type !== "table") {
          return;
        }

        const deletedColumnAccessor = section.columns[colIndex].accessor;

        section.columns.splice(colIndex, 1);
        section.columns.forEach((col, i) => {
          col.accessor = `col${i + 1}`;
        });

        section.rows.forEach((row) => {
          delete row[deletedColumnAccessor as keyof typeof row];
        });
        section.rows.forEach((row, i) => {
          const rowKeys = Object.keys(row) as (keyof typeof row)[];
          const rowKeysUpdated = rowKeys.map((_key, i) => `col${i + 1}`);
          const rowArrUpdated = rowKeysUpdated.map((rowKeyUpdated, i) => [
            rowKeyUpdated,
            row[rowKeys[i]],
          ]);
          const rowUpdated = Object.fromEntries(rowArrUpdated);

          section.rows[i] = rowUpdated;
        });
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
      addFootnote(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            footnote: { id: string; num: number };
          }
        >
      ) {
        const {
          id,
          translationId,
          footnote: footnoteToAdd,
          sectionId,
        } = action.payload;
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

        section.footnotes = section.footnotes || [];

        const existingFootnoteWithSameNumAsAddedIndex =
          section.footnotes.findIndex(
            (footnoteExisting) => footnoteExisting.num === footnoteToAdd.num
          );
        if (existingFootnoteWithSameNumAsAddedIndex > -1) {
          const ordered = section.footnotes.sort((a, b) => a.num - b.num);
          for (
            let i = existingFootnoteWithSameNumAsAddedIndex;
            i < ordered.length;
            i++
          ) {
            const footnote = section.footnotes[i];
            footnote.num = footnote.num + 1;
          }
        }
        section.footnotes.push({
          id: footnoteToAdd.id,
          text: "",
          num: footnoteToAdd.num,
        });
      },
      deleteFootnote(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            footnote: { id: string };
          }
        >
      ) {
        const {
          id,
          translationId,
          footnote: footnoteToDelete,
          sectionId,
        } = action.payload;
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

        const { footnotes } = section;

        if (!footnotes?.length) {
          return;
        }

        const index = footnotes.findIndex(
          (footnote) => footnote.id === footnoteToDelete.id
        );
        footnotes.splice(index, 1);
        footnotes.forEach((footnote, i) => {
          footnote.num = i + 1;
        });
      },
      updateFootnoteText(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            sectionId: string;
            footnote: { id: string; text: string };
          }
        >
      ) {
        const {
          id,
          translationId,
          footnote: footnoteUpdateData,
          sectionId,
        } = action.payload;
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

        const { footnotes } = section;

        if (!footnotes?.length) {
          return;
        }

        const footnote = footnotes.find(
          (footnote) => footnote.id === footnoteUpdateData.id
        );

        if (!footnote) {
          return;
        }
        footnote.text = footnoteUpdateData.text;
      },
      updateFootnoteNumber(
        state,
        action: PayloadAction<
          TranslationPayloadGeneric & {
            footnote: { id: string; num: number };
            sectionId: string;
          }
        >
      ) {
        const {
          id,
          translationId,
          footnote: footnoteUpdateData,
          sectionId,
        } = action.payload;
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

        const { footnotes } = section;

        if (!footnotes?.length) {
          return;
        }

        const footnote = footnotes.find(
          (footnote) => footnote.id === footnoteUpdateData.id
        );

        if (!footnote) {
          return;
        }
        footnote.num = footnoteUpdateData.num;
      },
      updateSummary(
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
        translation.summary = summary;
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
      addRelatedEntity(
        state,
        action: PayloadAction<{
          id: string;
          relatedEntity: {
            name: ArticleLikeRelatedEntityUnion;
            id: string;
          };
        }>
      ) {
        const { id, relatedEntity } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }

        const fieldKey = relatedEntityFieldMap[relatedEntity.name];
        entity[fieldKey].push(relatedEntity.id);
      },
      removeRelatedEntity(
        state,
        action: PayloadAction<{
          id: string;
          relatedEntity: {
            name: ArticleLikeRelatedEntityUnion;
            id: string;
          };
        }>
      ) {
        const { id, relatedEntity } = action.payload;
        const entity = state.entities[id];
        if (!entity) {
          return;
        }

        const fieldKey = relatedEntityFieldMap[relatedEntity.name];
        const index = entity[fieldKey].findIndex(
          (id) => id === relatedEntity.id
        );
        entity[fieldKey].splice(index, 1);
      },
      ...reducers,
    },
    extraReducers,
  });
}

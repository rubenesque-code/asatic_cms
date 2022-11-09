import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";
import { createSubject } from "^data/createDocument";

import { subjectsApi } from "^redux/services/subjects";
import { RootState } from "^redux/store";

import { Subject, SubjectTranslation } from "^types/subject";

const subjectAdapter = createEntityAdapter<Subject>();
const initialState = subjectAdapter.getInitialState();

const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Subject;
      }>
    ) {
      const { data } = action.payload;
      subjectAdapter.setOne(state, data);
    },
    overWriteAll(state, action: PayloadAction<Subject[]>) {
      const data = action.payload;
      subjectAdapter.setAll(state, data);
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      subjectAdapter.removeOne(state, id);
    },
    addOne(
      state,
      action: PayloadAction<{
        id?: string;
        name?: string;
        languageId: string;
      }>
    ) {
      const { id, languageId, name } = action.payload;

      const subject: Subject = createSubject({
        id: id || generateUId(),
        languageId,
        translationId: generateUId(),
        translationName: name,
      });

      subjectAdapter.addOne(state, subject);
    },
    addArticle(
      state,
      action: PayloadAction<{
        id: string;
        articleId: string;
      }>
    ) {
      const { id, articleId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.articlesIds.push(articleId);
    },
    removeArticle(
      state,
      action: PayloadAction<{
        id: string;
        articleId: string;
      }>
    ) {
      const { id, articleId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const index = entity.articlesIds.findIndex((id) => id === articleId);
      entity.articlesIds.splice(index, 1);
    },
    addBlog(
      state,
      action: PayloadAction<{
        id: string;
        blogId: string;
      }>
    ) {
      const { id, blogId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.blogsIds.push(blogId);
    },
    removeBlog(
      state,
      action: PayloadAction<{
        id: string;
        blogId: string;
      }>
    ) {
      const { id, blogId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const index = entity.blogsIds.findIndex((id) => id === blogId);
      entity.blogsIds.splice(index, 1);
    },
    addCollection(
      state,
      action: PayloadAction<{
        id: string;
        collectionId: string;
      }>
    ) {
      const { id, collectionId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.collectionsIds.push(collectionId);
    },
    removeCollection(
      state,
      action: PayloadAction<{
        id: string;
        collectionId: string;
      }>
    ) {
      const { id, collectionId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const index = entity.collectionsIds.findIndex(
        (id) => id === collectionId
      );
      entity.collectionsIds.splice(index, 1);
    },
    addRecordedEvent(
      state,
      action: PayloadAction<{
        id: string;
        recordedEventId: string;
      }>
    ) {
      const { id, recordedEventId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.recordedEventsIds.push(recordedEventId);
    },
    removeRecordedEvent(
      state,
      action: PayloadAction<{
        id: string;
        recordedEventId: string;
      }>
    ) {
      const { id, recordedEventId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const index = entity.recordedEventsIds.findIndex(
        (id) => id === recordedEventId
      );
      entity.recordedEventsIds.splice(index, 1);
    },
    addTranslation(
      state,
      action: PayloadAction<{
        id: string;
        languageId: string;
        name?: string;
      }>
    ) {
      const { id, languageId, name } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const translation: SubjectTranslation = {
        id: generateUId(),
        languageId,
        name,
      };

      entity.translations.push(translation);
    },
    removeTranslation(
      state,
      action: PayloadAction<{
        id: string;
        translationId: string;
      }>
    ) {
      const { id, translationId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const translations = entity.translations;
      const translationIndex = translations.findIndex(
        (t) => t.id === translationId
      );
      translations.splice(translationIndex, 1);
    },
    updateName(
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        translationId: string;
      }>
    ) {
      const { id, name, translationId } = action.payload;
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
      translation.name = name;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      subjectsApi.endpoints.fetchSubjects.matchFulfilled,
      (state, { payload }) => {
        subjectAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default subjectsSlice.reducer;

export const {
  overWriteOne,
  overWriteAll,
  addOne,
  removeOne,
  addTranslation,
  removeTranslation,
  addArticle,
  addBlog,
  addCollection,
  addRecordedEvent,
  removeArticle,
  removeBlog,
  removeCollection,
  removeRecordedEvent,
  updateName,
} = subjectsSlice.actions;

const {
  selectAll: selectSubjects,
  selectById: selectSubjectById,
  selectIds,
  selectTotal: selectTotalSubjects,
} = subjectAdapter.getSelectors((state: RootState) => state.subjects);

type SelectIdsAsserted = (args: Parameters<typeof selectIds>) => string[];
const selectSubjectsIds = selectIds as unknown as SelectIdsAsserted;

const selectSubjectsByIds = createSelector(
  [selectSubjects, (_state: RootState, ids: string[]) => ids],
  (subjects, ids) => ids.map((id) => subjects.find((s) => s.id === id))
);

export {
  selectSubjects,
  selectSubjectById,
  selectTotalSubjects,
  selectSubjectsIds,
  selectSubjectsByIds,
};

import {
  PayloadAction,
  createEntityAdapter,
  createSelector,
  nanoid,
} from "@reduxjs/toolkit";
import { createSubject } from "^data/createDocument";

import { subjectsApi } from "^redux/services/subjects";
import { RootState } from "^redux/store";

import { Subject, SubjectRelatedEntity } from "^types/subject";
import createDisplayContentGenericSlice from "./higher-order-reducers/displayContentGeneric";
import { relatedEntityFieldMap } from "./utilities/reducers";

const adapter = createEntityAdapter<Subject>();
const initialState = adapter.getInitialState();

const subjectsSlice = createDisplayContentGenericSlice({
  name: "subjects",
  initialState,
  reducers: {
    undoOne: adapter.setOne,
    undoAll: adapter.setAll,
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Subject;
      }>
    ) {
      const { data } = action.payload;
      adapter.setOne(state, data);
    },
    overWriteAll(state, action: PayloadAction<Subject[]>) {
      const data = action.payload;
      adapter.setAll(state, data);
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      adapter.removeOne(state, id);
    },
    addOne(
      state,
      action: PayloadAction<{
        id?: string;
        translation: {
          name?: string;
          languageId?: string;
        };
      }>
    ) {
      const { id, translation } = action.payload;

      const subject: Subject = createSubject({
        id,
        translation,
      });

      adapter.addOne(state, subject);
    },
    addRelatedEntity(
      state,
      action: PayloadAction<{
        id: string;
        relatedEntity: {
          name: SubjectRelatedEntity;
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
          name: SubjectRelatedEntity;
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
      const index = entity[fieldKey].findIndex((id) => id === relatedEntity.id);
      entity[fieldKey].splice(index, 1);
    },
    addTranslation(
      state,
      action: PayloadAction<{
        id: string;
        translation: {
          id?: string;
          languageId: string;
          title?: string;
        };
      }>
    ) {
      const { id, translation } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.translations.push({
        id: translation.id || nanoid(),
        languageId: translation.languageId,
        title: translation.title,
      });
    },
    updateTitle(
      state,
      action: PayloadAction<{
        id: string;
        title: string;
        translationId: string;
      }>
    ) {
      const { id, title, translationId } = action.payload;
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
      translation.title = title;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      subjectsApi.endpoints.fetchSubjects.matchFulfilled,
      (state, { payload }) => {
        adapter.upsertMany(state, payload);
      }
    );
    builder.addMatcher(
      subjectsApi.endpoints.createSubject.matchFulfilled,
      (state, { payload }) => {
        adapter.addOne(state, payload.subject);
      }
    );
    builder.addMatcher(
      subjectsApi.endpoints.deleteSubject.matchFulfilled,
      (state, { payload }) => {
        adapter.removeOne(state, payload.id);
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
  updateTitle,
  undoAll,
  undoOne,
  togglePublishStatus,
  updatePublishDate,
  updateSaveDate,
  addRelatedEntity,
  removeRelatedEntity,
} = subjectsSlice.actions;

const {
  selectAll: selectSubjects,
  selectById: selectSubjectById,
  selectIds,
  selectTotal: selectTotalSubjects,
} = adapter.getSelectors((state: RootState) => state.subjects);

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

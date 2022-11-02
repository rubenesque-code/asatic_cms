import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

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
        text: string;
        languageId: string;
      }>
    ) {
      const { id, languageId, text } = action.payload;

      const translation: SubjectTranslation = {
        id: generateUId(),
        languageId,
        text,
      };

      const subject: Subject = {
        id: id || generateUId(),
        translations: [translation],
        relatedEntities: [],
      };

      subjectAdapter.addOne(state, subject);
    },
    addRelatedEntity(
      state,
      action: PayloadAction<{
        id: string;
        relatedEntity: Subject["relatedEntities"][number];
      }>
    ) {
      const { id, relatedEntity } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      entity.relatedEntities.push(relatedEntity);
    },
    removeRelatedEntity(
      state,
      action: PayloadAction<{
        id: string;
        relatedEntityId: string;
      }>
    ) {
      const { id, relatedEntityId } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const index = entity.relatedEntities.findIndex(
        (e) => e.entityId === relatedEntityId
      );
      entity.relatedEntities.splice(index, 1);
    },
    addTranslation(
      state,
      action: PayloadAction<{
        id: string;
        languageId: string;
        text?: string;
      }>
    ) {
      const { id, languageId, text } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const translation: SubjectTranslation = {
        id: generateUId(),
        languageId,
        text: text || "",
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
    updateText(
      state,
      action: PayloadAction<{
        id: string;
        text: string;
        translationId: string;
      }>
    ) {
      const { id, text, translationId } = action.payload;
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
      translation.text = text;
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
  updateText,
  addTranslation,
  removeTranslation,
  addRelatedEntity: addRelatedEntityToSubject,
  removeRelatedEntity: removeRelatedEntityFromSubject,
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

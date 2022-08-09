import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
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
    overWriteAll(
      state,
      action: PayloadAction<{
        data: Subject[];
      }>
    ) {
      const { data } = action.payload;
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
      };

      subjectAdapter.addOne(state, subject);
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
} = subjectsSlice.actions;

export const { selectAll, selectById, selectTotal, selectEntities } =
  subjectAdapter.getSelectors((state: RootState) => state.subjects);
export const selectIds = (state: RootState) => state.subjects.ids as string[];

export const selectEntitiesByIds = (state: RootState, ids: string[]) => {
  const entities = state.subjects.entities;
  const selectedEntities = ids.map((id) => entities[id]);

  return selectedEntities;
};

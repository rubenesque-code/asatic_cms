import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

import { RootState } from "^redux/store";
import { recordedEventTypesApi } from "^redux/services/recordedEventTypes";

import {
  RecordedEventType,
  RecordedEventTypeTranslation,
} from "^types/recordedEventType";
import { createRecordedEventType } from "^data/createDocument";
import { default_language_Id } from "^constants/data";

const adapter = createEntityAdapter<RecordedEventType>();
const initialState = adapter.getInitialState();

const slice = createSlice({
  name: "recorded-event-types",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: RecordedEventType;
      }>
    ) {
      const { data } = action.payload;
      adapter.setOne(state, data);
    },
    overWriteAll(state, action: PayloadAction<RecordedEventType[]>) {
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
        name?: string;
        languageId?: string;
      }>
    ) {
      const { id, languageId, name } = action.payload;

      const recordedEventType = createRecordedEventType({
        id: id || generateUId(),
        translationId: generateUId(),
        languageId,
        name,
      });

      adapter.addOne(state, recordedEventType);
    },
    addTranslation(
      state,
      action: PayloadAction<{
        id: string;
        languageId?: string;
        name?: string;
      }>
    ) {
      const { id, languageId, name } = action.payload;
      const entity = state.entities[id];
      if (!entity) {
        return;
      }

      const translation: RecordedEventTypeTranslation = {
        id: generateUId(),
        languageId: languageId || default_language_Id,
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
      recordedEventTypesApi.endpoints.fetchRecordedEventTypes.matchFulfilled,
      (state, { payload }) => {
        adapter.upsertMany(state, payload);
      }
    );
  },
});

export default slice.reducer;

export const {
  overWriteOne,
  overWriteAll,
  addOne,
  removeOne,
  updateName,
  addTranslation,
  removeTranslation,
} = slice.actions;

const {
  selectAll: selectRecordedEventTypes,
  selectById: selectRecordedEventTypeById,
  selectIds: selectRecordedEventTypesIds,
  selectTotal: selectTotalRecordedEventTypes,
} = adapter.getSelectors((state: RootState) => state.recordedEventTypes);

const selectRecordedEventTypesByIds = createSelector(
  [selectRecordedEventTypes, (_state: RootState, ids: string[]) => ids],
  (subjects, ids) => ids.map((id) => subjects.find((s) => s.id === id))
);

export {
  selectRecordedEventTypeById,
  selectRecordedEventTypes,
  selectRecordedEventTypesByIds,
  selectRecordedEventTypesIds,
  selectTotalRecordedEventTypes,
};

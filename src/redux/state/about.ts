import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  nanoid,
} from "@reduxjs/toolkit";

import { aboutApi } from "../services/about";

import { AboutPage } from "^types/about";
import { RootState } from "^redux/store";

const adapter = createEntityAdapter<AboutPage>();
const initialState = adapter.getInitialState();

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    overWriteAll(
      state,
      action: PayloadAction<{
        data: AboutPage[];
      }>
    ) {
      const { data } = action.payload;
      adapter.setAll(state, data);
    },
    updateText(
      state,
      action: PayloadAction<{
        text: string;
        translationId: string;
      }>
    ) {
      const { text, translationId } = action.payload;
      const entity = state.entities[0];

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
    addTranslation(
      state,
      action: PayloadAction<{
        translationId?: string;
        languageId: string;
      }>
    ) {
      const { translationId, languageId } = action.payload;
      const entity = state.entities[0];

      if (!entity) {
        return;
      }

      entity.translations.push({
        id: translationId || nanoid(),
        languageId,
        text: "",
      });
    },
    deleteTranslation(
      state,
      action: PayloadAction<{
        translationId: string;
      }>
    ) {
      const { translationId } = action.payload;
      const entity = state.entities[0];

      if (!entity) {
        return;
      }

      const translationIndex = entity.translations.findIndex(
        (t) => t.id === translationId
      );

      if (translationIndex < 0) {
        return;
      }

      entity.translations.splice(translationIndex, 1);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      aboutApi.endpoints.fetchAbout.matchFulfilled,
      (state, { payload }) => {
        adapter.upsertMany(state, payload);
      }
    );
  },
});

export default aboutSlice.reducer;

export const { overWriteAll } = aboutSlice.actions;

export const { selectAll, selectById, selectTotal, selectIds } =
  adapter.getSelectors((state: RootState) => state.about);

import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
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
      const entity = state.entities[state.ids[0]];

      if (!entity) {
        return;
      }

      const translation = entity.translations.find(
        (t) => t.id === translationId
      );
      console.log("translation:", translation);

      if (!translation) {
        return;
      }

      translation.text = text;
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

export const { overWriteAll, updateText } = aboutSlice.actions;

export const { selectAll, selectById, selectTotal, selectIds } =
  adapter.getSelectors((state: RootState) => state.about);

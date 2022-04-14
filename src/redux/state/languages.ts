import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
// import { v4 as generateUId } from "uuid";

import { languagesApi } from "^redux/services/languages";
import { RootState } from "^redux/store";

import { Language, Languages } from "^types/language";

const languageAdapter = createEntityAdapter<Language>();
const initialState = languageAdapter.getInitialState();

const languagesSlice = createSlice({
  name: "languages",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Language;
      }>
    ) {
      const { data } = action.payload;
      languageAdapter.setOne(state, data);
    },
    overWriteAll(
      state,
      action: PayloadAction<{
        data: Languages;
      }>
    ) {
      const { data } = action.payload;
      languageAdapter.setAll(state, data);
    },
    // addOne(
    //   state,
    //   action: PayloadAction<{
    //     defaultTranslationId: string;
    //   }>
    // ) {
    //   const {defaultTranslationId} = action.payload
    //   articleAdapter.addOne(state, {
    //     id: generateUId(),
    //     defaultTranslationId,
    //   });
    // },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      languageAdapter.removeOne(state, id);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      languagesApi.endpoints.fetchLanguages.matchFulfilled,
      (state, { payload }) => {
        languageAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default languagesSlice.reducer;

export const { overWriteOne, overWriteAll, removeOne } = languagesSlice.actions;

export const { selectAll, selectById, selectTotal, selectEntities } =
  languageAdapter.getSelectors((state: RootState) => state.languages);
export const selectIds = (state: RootState) => state.languages.ids as string[];
export const selectEntitiesByIds = (state: RootState, ids: string[]) =>
  Object.values(state.languages.entities).filter((entity) =>
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ids.includes(entity!.id)
  );

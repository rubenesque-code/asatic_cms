import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
// import { v4 as generateUId } from "uuid";

import { languagesApi } from "^redux/services/languages";
import { RootState } from "^redux/store";

import { Language, Languages } from "^types/language";

const adapter = createEntityAdapter<Language>();
const initialState = adapter.getInitialState();

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
      adapter.setOne(state, data);
    },
    overWriteAll(
      state,
      action: PayloadAction<{
        data: Languages;
      }>
    ) {
      const { data } = action.payload;
      adapter.setAll(state, data);
    },
    addOne(
      state,
      action: PayloadAction<{
        name: string;
      }>
    ) {
      const { name } = action.payload;
      adapter.addOne(state, {
        id: name,
        name,
      });
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
    updateName(
      state,
      action: PayloadAction<{
        id: string;
        name: string;
      }>
    ) {
      const { id, name } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.name = name;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      languagesApi.endpoints.fetchLanguages.matchFulfilled,
      (state, { payload }) => {
        adapter.upsertMany(state, payload);
      }
    );
  },
});

export default languagesSlice.reducer;

export const { overWriteOne, overWriteAll, addOne, removeOne, updateName } =
  languagesSlice.actions;

const {
  selectAll: selectLanguages,
  selectById: selectLanguageById,
  selectIds,
  selectTotal: selectTotalLanguages,
} = adapter.getSelectors((state: RootState) => state.languages);

type SelectIdsAsserted = (args: Parameters<typeof selectIds>) => string[];
const selectLanguagesIds = selectIds as unknown as SelectIdsAsserted;

const selectLanguagesByIds = createSelector(
  [selectLanguages, (_state: RootState, ids: string[]) => ids],
  (languages, ids) => ids.map((id) => languages.find((s) => s.id === id))
);

export {
  selectLanguages,
  selectLanguageById,
  selectTotalLanguages,
  selectLanguagesIds,
  selectLanguagesByIds,
};

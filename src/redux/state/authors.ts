import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

import { authorsApi } from "^redux/services/authors";
import { RootState } from "^redux/store";

import { DEFAULTLANGUAGEID } from "^constants/data";

import { Author } from "^types/author";

const authorAdapter = createEntityAdapter<Author>();
const initialState = authorAdapter.getInitialState();

const authorSlice = createSlice({
  name: "author",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Author;
      }>
    ) {
      const { data } = action.payload;
      authorAdapter.setOne(state, data);
    },
    overWriteAll(
      state,
      action: PayloadAction<{
        data: Author[];
      }>
    ) {
      const { data } = action.payload;
      authorAdapter.setAll(state, data);
    },
    addOne(state) {
      const author: Author = {
        id: generateUId(),
        translations: [
          { id: generateUId(), languageId: DEFAULTLANGUAGEID, name: "" },
        ],
      };

      authorAdapter.addOne(state, author);
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      authorAdapter.removeOne(state, id);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authorsApi.endpoints.fetchAuthors.matchFulfilled,
      (state, { payload }) => {
        authorAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default authorSlice.reducer;

export const { overWriteOne, overWriteAll, removeOne, addOne } =
  authorSlice.actions;

export const { selectAll, selectById, selectTotal } =
  authorAdapter.getSelectors((state: RootState) => state.authors);
export const selectIds = (state: RootState) => state.authors.ids as string[];

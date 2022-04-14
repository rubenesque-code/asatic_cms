import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
// import { v4 as generateUId } from "uuid";

import { tagsApi } from "^redux/services/tags";
import { RootState } from "^redux/store";

import { Tag, Tags } from "^types/tag";

const tagAdapter = createEntityAdapter<Tag>();
const initialState = tagAdapter.getInitialState();

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    overWriteOne(
      state,
      action: PayloadAction<{
        data: Tag;
      }>
    ) {
      const { data } = action.payload;
      tagAdapter.setOne(state, data);
    },
    overWriteAll(
      state,
      action: PayloadAction<{
        data: Tags;
      }>
    ) {
      const { data } = action.payload;
      tagAdapter.setAll(state, data);
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
      tagAdapter.removeOne(state, id);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      tagsApi.endpoints.fetchTags.matchFulfilled,
      (state, { payload }) => {
        tagAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default tagsSlice.reducer;

export const { overWriteOne, overWriteAll, removeOne } = tagsSlice.actions;

export const { selectAll, selectById, selectTotal, selectEntities } =
  tagAdapter.getSelectors((state: RootState) => state.tags);
export const selectIds = (state: RootState) => state.tags.ids as string[];
export const selectEntitiesByIds = (state: RootState, ids: string[]) =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  Object.values(state.tags.entities).filter((tag) => ids.includes(tag!.id));

import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
  createSelector,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

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
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      tagAdapter.removeOne(state, id);
    },
    addOne(
      state,
      action: PayloadAction<{
        id?: string;
        text: string;
      }>
    ) {
      const { id, text } = action.payload;
      tagAdapter.addOne(state, { id: id || generateUId(), text });
    },
    updateText(
      state,
      action: PayloadAction<{
        id: string;
        text: string;
      }>
    ) {
      const { id, text } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.text = text;
      }
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

export const { overWriteOne, overWriteAll, addOne, removeOne, updateText } =
  tagsSlice.actions;

const {
  selectAll: selectTags,
  selectById: selectTagById,
  selectIds,
  selectTotal: selectTotalTags,
} = tagAdapter.getSelectors((state: RootState) => state.tags);

type SelectIdsAsserted = (args: Parameters<typeof selectIds>) => string[];
const selectTagsIds = selectIds as unknown as SelectIdsAsserted;

const selectTagsByIds = createSelector(
  [selectTags, (_state: RootState, ids: string[]) => ids],
  (tags, ids) => ids.map((id) => tags.find((s) => s.id === id))
);

export {
  selectTags,
  selectTagById,
  selectTotalTags,
  selectTagsIds,
  selectTagsByIds,
};

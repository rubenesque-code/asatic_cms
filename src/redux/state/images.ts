import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import { imagesApi } from "^redux/services/images";
import { RootState } from "^redux/store";

import { Image } from "^types/image";

const imageAdapter = createEntityAdapter<Image>();
const initialState = imageAdapter.getInitialState();

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      imageAdapter.removeOne(state, id);
    },
    addOne(
      state,
      action: PayloadAction<{
        id: string;
        URL: string;
      }>
    ) {
      const { id, URL } = action.payload;
      imageAdapter.addOne(state, { id, URL });
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      imagesApi.endpoints.fetchImages.matchFulfilled,
      (state, { payload }) => {
        imageAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default imagesSlice.reducer;

export const { addOne, removeOne } = imagesSlice.actions;

export const { selectAll, selectById, selectTotal, selectEntities } =
  imageAdapter.getSelectors((state: RootState) => state.images);
export const selectIds = (state: RootState) => state.tags.ids as string[];
export const selectEntitiesByIds = (state: RootState, ids: string[]) => {
  const entities = state.images.entities;
  const entityArr = Object.values(entities) as Image[];
  const selectedEntities = entityArr.filter((tag) => ids.includes(tag.id));
  return selectedEntities;
};

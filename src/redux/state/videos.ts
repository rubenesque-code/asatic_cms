import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import { videosApi } from "^redux/services/videos";
import { RootState } from "^redux/store";

import { Video } from "^types/video";

const videoAdapter = createEntityAdapter<Video>();
const initialState = videoAdapter.getInitialState();

const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    addOne(state, action: PayloadAction<Video>) {
      const video = action.payload;
      videoAdapter.addOne(state, video);
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      videoAdapter.removeOne(state, id);
    },
    addArticleRelation(
      state,
      action: PayloadAction<{
        articleId: string;
        id: string;
      }>
    ) {
      const { articleId, id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const relatedArticleIds = entity.relatedArticleIds;
        if (relatedArticleIds) {
          relatedArticleIds.push(articleId);
        } else {
          entity.relatedArticleIds = [articleId];
        }
      }
    },
    removeArticleRelation(
      state,
      action: PayloadAction<{
        articleId: string;
        id: string;
      }>
    ) {
      const { articleId, id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        const relatedArticleIds = entity.relatedArticleIds!;
        const index = relatedArticleIds.findIndex((id) => id === articleId);
        relatedArticleIds.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      videosApi.endpoints.fetchVideos.matchFulfilled,
      (state, { payload }) => {
        videoAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default videosSlice.reducer;

export const { addOne, removeOne, addArticleRelation, removeArticleRelation } =
  videosSlice.actions;

export const { selectAll, selectById, selectTotal, selectEntities } =
  videoAdapter.getSelectors((state: RootState) => state.videos);
export const selectIds = (state: RootState) => state.tags.ids as string[];
export const selectEntitiesByIds = (state: RootState, ids: string[]) => {
  const entities = state.videos.entities;
  const entityArr = Object.values(entities) as Video[];
  const selectedEntities = entityArr.filter((tag) => ids.includes(tag.id));
  return selectedEntities;
};

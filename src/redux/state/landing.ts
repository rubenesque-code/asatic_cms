import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

import { landingApi } from "../services/landing";

import {
  LandingSection,
  LandingSectionAuto,
  LandingSectionCustom,
} from "^types/landing";
import { RootState } from "^redux/store";

// todo: article image + blurb landing should be within article type

const landingAdapter = createEntityAdapter<LandingSection>({
  sortComparer: (a, b) => a.order - b.order,
});
const initialState = landingAdapter.getInitialState();

const landingSlice = createSlice({
  name: "landing",
  initialState,
  reducers: {
    overWriteAll(
      state,
      action: PayloadAction<{
        data: LandingSection[];
      }>
    ) {
      const { data } = action.payload;
      landingAdapter.setAll(state, data);
    },
    addOne(
      state,
      action: PayloadAction<{
        type: LandingSection["type"];
        contentType?: LandingSectionAuto["contentType"];
        positionNum: number;
      }>
    ) {
      const { type, contentType, positionNum } = action.payload;

      const sectionsById = state.ids as string[];
      const newSectionIndex = positionNum - 1;
      for (let i = newSectionIndex; i < sectionsById.length; i++) {
        landingAdapter.updateOne(state, {
          id: sectionsById[i],
          changes: {
            order: i + 2,
          },
        });
      }

      const sectionSharedFields = {
        id: generateUId(),
        order: positionNum,
      };
      if (type === "auto" && contentType) {
        const section: LandingSectionAuto = {
          ...sectionSharedFields,
          type: "auto",
          contentType,
        };
        landingAdapter.addOne(state, section);
      } else {
        const section: LandingSectionCustom = {
          ...sectionSharedFields,
          type: "custom",
          sections: [],
        };
        landingAdapter.addOne(state, section);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      landingApi.endpoints.fetchLanding.matchFulfilled,
      (state, { payload }) => {
        landingAdapter.upsertMany(state, payload);
      }
    );
  },
});

export default landingSlice.reducer;

export const { addOne, overWriteAll } = landingSlice.actions;

export const { selectAll, selectById, selectTotal } =
  landingAdapter.getSelectors((state: RootState) => state.landing);

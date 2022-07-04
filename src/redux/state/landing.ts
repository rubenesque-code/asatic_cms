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
    addOne(
      state,
      action: PayloadAction<{
        type: LandingSection["type"];
        contentType?: LandingSectionAuto["contentType"];
      }>
    ) {
      const { type, contentType } = action.payload;
      const sectionSharedFields = {
        id: generateUId(),
        order: state.ids.length + 1,
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

export const { addOne } = landingSlice.actions;

export const { selectAll, selectById, selectTotal } =
  landingAdapter.getSelectors((state: RootState) => state.landing);

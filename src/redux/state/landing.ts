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
import { sortComponents } from "^helpers/general";
import { MyOmit } from "^types/utilities";

type CustomComponent = LandingSectionCustom["components"][number];

const landingAdapter = createEntityAdapter<LandingSection>({
  sortComparer: (a, b) => a.index - b.index,
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
      action: PayloadAction<
        | MyOmit<LandingSectionAuto, "id">
        | MyOmit<LandingSectionCustom, "id" | "components">
      >
    ) {
      const { type, index: newSectionIndex } = action.payload;

      // update other sections index fields. Everything before stays the same, everything after up by 1.
      const sectionsById = state.ids as string[];
      for (let i = newSectionIndex; i < sectionsById.length; i++) {
        landingAdapter.updateOne(state, {
          id: sectionsById[i],
          changes: {
            index: i + 1,
          },
        });
      }

      const newSectionSharedFields = {
        id: generateUId(),
        index: newSectionIndex,
      };

      if (type === "auto") {
        const { contentType } = action.payload;
        const section: LandingSectionAuto = {
          ...newSectionSharedFields,
          type: "auto",
          contentType,
        };

        landingAdapter.addOne(state, section);
      } else {
        const section: LandingSectionCustom = {
          ...newSectionSharedFields,
          type: "custom",
          components: [],
        };

        landingAdapter.addOne(state, section);
      }
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      landingAdapter.removeOne(state, id);
    },
    moveSection(
      state,
      action: PayloadAction<{
        id: string;
        direction: "up" | "down";
      }>
    ) {
      const { id: activeId, direction } = action.payload;

      const entities = state.entities;

      const activeEntity = entities[activeId];

      if (!activeEntity) {
        return;
      }

      const activeIndex = activeEntity.index;
      const swapWithIndex =
        direction === "down" ? activeIndex + 1 : activeIndex - 1;

      const swapWithId = state.ids[swapWithIndex];
      const swapWithEntity = entities[swapWithId];

      if (!swapWithEntity) {
        return;
      }

      landingAdapter.updateMany(state, [
        {
          id: activeId,
          changes: {
            index: swapWithIndex,
          },
        },
        {
          id: swapWithEntity.id,
          changes: {
            index: activeIndex,
          },
        },
      ]);
    },
    addComponentToCustom(
      state,
      action: PayloadAction<{
        id: string;
        docId: string;
        type: LandingSectionCustom["components"][number]["type"];
      }>
    ) {
      const { id, docId: articleId, type } = action.payload;
      const entity = state.entities[id];
      if (entity && entity.type === "custom") {
        const numComponents = entity.components.length;

        const newComponent: LandingSectionCustom["components"][number] = {
          docId: articleId,
          id: generateUId(),
          index: numComponents,
          width: 2,
          type,
        };

        entity.components.push(newComponent);
      }
    },
    reorderCustomSection(
      state,
      action: PayloadAction<{
        id: string;
        activeId: string;
        overId: string;
      }>
    ) {
      const { activeId, overId, id } = action.payload;

      const entity = state.entities[id];

      if (entity && entity.type === "custom") {
        const components = sortComponents(entity.components);

        const activeIndex = components.findIndex((c) => c.id === activeId)!;
        const overIndex = components.findIndex((c) => c.id === overId)!;

        if (activeIndex > overIndex) {
          for (let i = overIndex; i < activeIndex; i++) {
            const component = components[i];
            component.index = component.index + 1;
          }
        } else if (overIndex > activeIndex) {
          for (let i = activeIndex + 1; i <= overIndex; i++) {
            const component = components[i];
            component.index = component.index - 1;
          }
        }
        const activeComponent = components[activeIndex];
        activeComponent.index = overIndex;
      }
    },
    deleteComponentFromCustom(
      state,
      action: PayloadAction<{
        id: string;
        componentId: string;
      }>
    ) {
      const { componentId, id } = action.payload;
      const entity = state.entities[id];
      if (entity && entity.type === "custom") {
        const components = entity.components;
        const index = entity.components.findIndex((c) => c.id === componentId);

        components.splice(index, 1);
      }
    },
    updateComponentWidth(
      state,
      action: PayloadAction<{
        id: string;
        componentId: string;
        width: CustomComponent["width"];
      }>
    ) {
      const { componentId, id, width } = action.payload;
      const entity = state.entities[id];
      if (entity && entity.type === "custom") {
        const component = entity.components.find((c) => c.id === componentId);

        if (component) {
          component.width = width;
        }
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

export const {
  addOne,
  overWriteAll,
  removeOne,
  moveSection,
  addComponentToCustom,
  reorderCustomSection,
  updateComponentWidth,
  deleteComponentFromCustom,
} = landingSlice.actions;

export const { selectAll, selectById, selectTotal, selectIds } =
  landingAdapter.getSelectors((state: RootState) => state.landing);

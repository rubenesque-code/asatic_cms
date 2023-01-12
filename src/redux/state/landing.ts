import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  nanoid,
} from "@reduxjs/toolkit";

import { landingApi } from "../services/landing";

import { LandingCustomSectionComponent } from "^types/landing";
import { RootState } from "^redux/store";

const landingAdapter = createEntityAdapter<LandingCustomSectionComponent>();
const initialState = landingAdapter.getInitialState();

const landingSlice = createSlice({
  name: "landing",
  initialState,
  reducers: {
    overWriteAll(
      state,
      action: PayloadAction<{
        data: LandingCustomSectionComponent[];
      }>
    ) {
      const { data } = action.payload;
      landingAdapter.setAll(state, data);
    },
    addOne(
      state,
      action: PayloadAction<{
        section: LandingCustomSectionComponent["section"];
        entity: LandingCustomSectionComponent["entity"];
      }>
    ) {
      const newComponent = action.payload;

      landingAdapter.addOne(state, {
        ...newComponent,
        index: state.ids.length,
        id: nanoid(),
        width: 2,
      });
    },
    populateEmptySection(
      state,
      action: PayloadAction<{
        section: LandingCustomSectionComponent["section"];
        entities: LandingCustomSectionComponent["entity"][];
      }>
    ) {
      const componentsPayload = action.payload;
      const newComponents: LandingCustomSectionComponent[] =
        componentsPayload.entities.map((entity, index) => ({
          entity,
          id: nanoid(),
          index,
          section: componentsPayload.section,
          width:
            (componentsPayload.section === 0 && index === 1) || index === 2
              ? 1
              : 2,
        }));

      landingAdapter.addMany(state, newComponents);
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const removedComponentPayload = action.payload;
      const removedComponent = state.entities[removedComponentPayload.id];

      if (!removedComponent) {
        return;
      }

      const sectionComponents = state.ids
        .map((id) => state.entities[id]!)
        .filter((component) => component.section === removedComponent.section)
        .sort((a, b) => a.index - b.index);

      for (let i = removedComponent.index; i < sectionComponents.length; i++) {
        landingAdapter.updateOne(state, {
          id: sectionComponents[i].id,
          changes: {
            index: i - 1,
          },
        });
      }

      landingAdapter.removeOne(state, removedComponentPayload.id);
    },
    reorderCustomSection(
      state,
      action: PayloadAction<{
        section: LandingCustomSectionComponent["section"];
        activeId: string;
        overId: string;
      }>
    ) {
      const reorderedSectionPayload = action.payload;

      const sectionComponents = state.ids
        .map((id) => state.entities[id]!)
        .filter(
          (component) => component.section === reorderedSectionPayload.section
        )
        .sort((a, b) => a.index - b.index);

      const activeComponent = state.entities[reorderedSectionPayload.activeId];
      const overComponent = state.entities[reorderedSectionPayload.overId];

      if (!activeComponent || !overComponent) {
        return;
      }

      const overComponentIndexBeforeUpdate = overComponent.index;

      if (activeComponent.index > overComponent.index) {
        for (let i = overComponent.index; i < activeComponent.index; i++) {
          const component = sectionComponents[i];
          component.index = component.index + 1;
        }
      } else {
        for (let i = activeComponent.index + 1; i <= overComponent.index; i++) {
          const component = sectionComponents[i];
          component.index = component.index - 1;
        }
      }
      activeComponent.index = overComponentIndexBeforeUpdate;
    },
    updateComponentWidth(
      state,
      action: PayloadAction<{
        id: string;
        width: 1 | 2;
      }>
    ) {
      const updatedComponentPayload = action.payload;
      const component = state.entities[updatedComponentPayload.id];

      if (!component) {
        return;
      }

      if (component) {
        component.width = updatedComponentPayload.width;
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
  reorderCustomSection,
  updateComponentWidth,
  populateEmptySection,
} = landingSlice.actions;

export const { selectAll, selectById, selectTotal, selectIds } =
  landingAdapter.getSelectors((state: RootState) => state.landing);

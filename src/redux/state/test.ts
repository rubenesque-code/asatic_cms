import { createEntityAdapter, PayloadAction } from "@reduxjs/toolkit";
import { createGenericSlice } from "./actions";

/* const data = [
  { id: "1", order: 1 },
  { id: "2", order: 2 },
]; */

type Entity = { id: string; order: number; afield: string };

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createGenericSlice({
  initialState,
  name: "testSlice",
  reducers: {
    udpateAField(state, action: PayloadAction<{ id: string; afield: string }>) {
      const { afield, id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity.afield = afield;
      }
    },
  },
});

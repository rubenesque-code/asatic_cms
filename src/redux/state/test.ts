import {
  PayloadAction,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";

type Entity = { id: string; text: string };

const adapter = createEntityAdapter<Entity>();
const initialState = adapter.getInitialState();

const slice = createSlice({
  name: "test",
  initialState,
  reducers: {
    testPrepare: {
      reducer(state, action: PayloadAction<{ id: string; text: string }>) {
        const { id, text } = action.payload;
        const entity = state.entities[id];
        if (entity) {
          entity.text = text;
        }
      },
      prepare(text: string) {
        return { payload: { id: "hello", text } };
      },
    },
  },
});

export default slice.reducer;

export const { testPrepare } = slice.actions;

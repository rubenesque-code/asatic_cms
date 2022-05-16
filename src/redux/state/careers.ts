import {
  createSlice,
  PayloadAction,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { v4 as generateUId } from "uuid";

import { RootState } from "^redux/store";

export type Career = {
  id: string;
  role: string;
  closingDate: string;
  description: string;
  detailsDownloadLink: string;
  applicationDownloadLink: string;
};

const careersAdapter = createEntityAdapter<Career>();
const initialState = careersAdapter.getInitialState();

const careersSlice = createSlice({
  name: "careers",
  initialState,
  reducers: {
    overWrite(
      state,
      action: PayloadAction<{
        data: Career[];
      }>
    ) {
      const { data } = action.payload;
      careersAdapter.setAll(state, data);
    },
    addOne(state) {
      careersAdapter.addOne(state, {
        id: generateUId(),
        role: "",
        closingDate: "",
        description: "",
        applicationDownloadLink: "",
        detailsDownloadLink: "",
      });
    },
    removeOne(
      state,
      action: PayloadAction<{
        id: string;
      }>
    ) {
      const { id } = action.payload;
      careersAdapter.removeOne(state, id);
    },
    updatePrimaryTextField(
      state,
      action: PayloadAction<{
        id: string;
        field: keyof Career;
        text: string;
      }>
    ) {
      const { field, text, id } = action.payload;
      const entity = state.entities[id];
      if (entity) {
        entity[field] = text;
      }
    },
  },
});

export default careersSlice.reducer;

export const {
  addOne: addCareer,
  removeOne: removeCareer,
  updatePrimaryTextField: updateCareerPrimaryTextField,
  overWrite: overWriteCareers,
} = careersSlice.actions;

export const { selectAll: selectAllCareers, selectById: selectCareerById } =
  careersAdapter.getSelectors((state: RootState) => state.careers);

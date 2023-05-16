import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  addTableColumn,
  addTableRow,
  deleteTableColumn,
  deleteTableRow,
  updateTableCellText,
  updateTableHeaderText,
  updateTableNotes,
  updateTableTitle,
  toggleTableCol1IsTitular,
} from "^redux/state/blogs";

import { checkObjectHasField } from "^helpers/general";

import { OmitFromMethods } from "^types/utilities";
import { TableSection } from "^types/article-like-entity";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function BlogTableSectionSlice() {}

const actionsInitial = {
  addTableColumn,
  addTableRow,
  deleteTableColumn,
  deleteTableRow,
  updateTableCellText,
  updateTableHeaderText,
  updateTableNotes,
  updateTableTitle,
  toggleTableCol1IsTitular,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<
  ActionsInitial,
  "id" | "translationId" | "sectionId"
>;

type ContextValue = [section: TableSection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

BlogTableSectionSlice.Provider = function BlogTableSectionProvider({
  children,
  translationId,
  blogId,
  section,
}: {
  children: ReactElement;
  translationId: string;
  blogId: string;
  section: TableSection;
}) {
  const { id: sectionId } = section;

  const dispatch = useDispatch();

  const sharedArgs = {
    id: blogId,
    translationId,
    sectionId,
  };

  const actions: Actions = {
    addTableColumn: (args) =>
      dispatch(addTableColumn({ ...sharedArgs, ...args })),
    addTableRow: () => dispatch(addTableRow({ ...sharedArgs })),
    deleteTableColumn: (args) =>
      dispatch(deleteTableColumn({ ...sharedArgs, ...args })),
    deleteTableRow: (args) =>
      dispatch(deleteTableRow({ ...sharedArgs, ...args })),
    updateTableCellText: (args) =>
      dispatch(updateTableCellText({ ...sharedArgs, ...args })),
    updateTableHeaderText: (args) =>
      dispatch(updateTableHeaderText({ ...sharedArgs, ...args })),
    updateTableNotes: (args) =>
      dispatch(updateTableNotes({ ...sharedArgs, ...args })),
    updateTableTitle: (args) =>
      dispatch(updateTableTitle({ ...sharedArgs, ...args })),
    toggleTableCol1IsTitular: () =>
      dispatch(toggleTableCol1IsTitular({ ...sharedArgs })),
  };

  const value = [section, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

BlogTableSectionSlice.useContext = function useBlogTableSectionContext() {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useBlogTableSectionContext must be used within its provider!"
    );
  }
  return context;
};

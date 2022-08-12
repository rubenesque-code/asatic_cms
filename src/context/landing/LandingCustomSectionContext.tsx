import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import {
  moveDown,
  moveUp,
  removeOne,
  addComponentToCustom,
  reorderCustomSection,
  deleteComponentFromCustom,
} from "^redux/state/landing";
import { LandingSectionCustom } from "^types/landing";

import { OmitFromMethods } from "^types/utilities";

const actionsInitial = {
  addComponentToCustom,
  deleteComponentFromCustom,
  moveDown,
  moveUp,
  removeOne,
  reorderCustomSection,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [section: LandingSectionCustom, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const LandingAutoSectionProvider = ({
  section,
  children,
}: {
  section: LandingSectionCustom;
  children: ReactElement;
}) => {
  const { id } = section;

  const dispatch = useDispatch();

  const actions: Actions = {
    addComponentToCustom: (args) =>
      dispatch(addComponentToCustom({ ...args, id })),
    deleteComponentFromCustom: (args) =>
      dispatch(deleteComponentFromCustom({ ...args, id })),
    moveDown: () => dispatch(moveDown({ id })),
    moveUp: () => dispatch(moveUp({ id })),
    removeOne: () => dispatch(removeOne({ id })),
    reorderCustomSection: (args) =>
      dispatch(reorderCustomSection({ ...args, id })),
  };

  return (
    <Context.Provider value={[section, actions]}>{children}</Context.Provider>
  );
};

const useLandingAutoSectionContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error(
      "useLandingAutoSectionContext must be used within its provider!"
    );
  }
  return context;
};

export { LandingAutoSectionProvider, useLandingAutoSectionContext };

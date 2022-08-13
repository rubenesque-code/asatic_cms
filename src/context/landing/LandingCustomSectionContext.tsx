import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import {
  addComponentToCustom,
  reorderCustomSection,
  deleteComponentFromCustom,
} from "^redux/state/landing";
import { LandingSectionCustom } from "^types/landing";

import { OmitFromMethods } from "^types/utilities";

const actionsInitial = {
  addComponentToCustom,
  deleteComponentFromCustom,
  reorderCustomSection,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [section: LandingSectionCustom, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const LandingCustomSectionProvider = ({
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
    reorderCustomSection: (args) =>
      dispatch(reorderCustomSection({ ...args, id })),
  };

  return (
    <Context.Provider value={[section, actions]}>{children}</Context.Provider>
  );
};

const useLandingCustomSectionContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error(
      "useLandingCustomSectionContext must be used within its provider!"
    );
  }
  return context;
};

export { LandingCustomSectionProvider, useLandingCustomSectionContext };

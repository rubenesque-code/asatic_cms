import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import { moveSection, removeOne } from "^redux/state/landing";
import { LandingSection } from "^types/landing";

import { OmitFromMethods } from "^types/utilities";

const actionsInitial = { moveSection, removeOne };

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [section: LandingSection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const LandingSectionProvider = ({
  section,
  children,
}: {
  section: LandingSection;
  children: ReactElement;
}) => {
  const { id } = section;

  const dispatch = useDispatch();

  const actions: Actions = {
    moveSection: (args) => dispatch(moveSection({ id, ...args })),
    removeOne: () => dispatch(removeOne({ id })),
  };

  return (
    <Context.Provider value={[section, actions]}>{children}</Context.Provider>
  );
};

const useLandingSectionContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error(
      "useLandingSectionContext must be used within its provider!"
    );
  }
  return context;
};

export { LandingSectionProvider, useLandingSectionContext };

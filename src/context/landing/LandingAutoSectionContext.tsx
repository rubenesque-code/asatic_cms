import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import { moveDown, moveUp, removeOne } from "^redux/state/landing";
import { LandingSectionAuto } from "^types/landing";

import { OmitFromMethods } from "^types/utilities";

const actionsInitial = { moveDown, moveUp, removeOne };

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [section: LandingSectionAuto, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const LandingAutoSectionProvider = ({
  section,
  children,
}: {
  section: LandingSectionAuto;
  children: ReactElement;
}) => {
  const { id } = section;

  const dispatch = useDispatch();

  const actions: Actions = {
    moveDown: () => dispatch(moveDown({ id })),
    moveUp: () => dispatch(moveUp({ id })),
    removeOne: () => dispatch(removeOne({ id })),
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

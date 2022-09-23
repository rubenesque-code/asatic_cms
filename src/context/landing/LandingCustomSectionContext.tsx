import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import {
  addComponentToCustom,
  reorderCustomSection,
} from "^redux/state/landing";
import { LandingSectionCustom } from "^types/landing";

import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function LandingCustomSectionSlice() {}

const actionsInitial = {
  addComponentToCustom,
  reorderCustomSection,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [section: LandingSectionCustom, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

LandingCustomSectionSlice.Provider = function LandingCustomSectionProvider({
  section,
  children,
}: {
  section: LandingSectionCustom;
  children: ReactElement;
}) {
  const { id } = section;

  const dispatch = useDispatch();

  const actions: Actions = {
    addComponentToCustom: (args) =>
      dispatch(addComponentToCustom({ ...args, id })),
    reorderCustomSection: (args) =>
      dispatch(reorderCustomSection({ ...args, id })),
  };

  return (
    <Context.Provider value={[section, actions]}>{children}</Context.Provider>
  );
};

LandingCustomSectionSlice.useContext =
  function useLandingCustomSectionContext() {
    const context = useContext(Context);
    const contextIsPopulated = checkObjectHasField(context[0]);
    if (!contextIsPopulated) {
      throw new Error(
        "useLandingCustomSectionContext must be used within its provider!"
      );
    }
    return context;
  };

import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import { reorderCustomSection } from "^redux/state/landing";
import { LandingCustomSectionComponent } from "^types/landing";

import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function LandingCustomSectionSlice() {}

const actionsInitial = {
  reorderCustomSection,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [
  section: LandingCustomSectionComponent[],
  actions: Actions
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

LandingCustomSectionSlice.Provider = function LandingCustomSectionProvider({
  section,
  children,
}: {
  section: LandingCustomSectionComponent[];
  children: ReactElement;
}) {
  const { id } = section;

  const dispatch = useDispatch();

  const actions: Actions = {
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

import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import { updateComponentWidth, removeOne } from "^redux/state/landing";
import { LandingCustomSectionComponent } from "^types/landing";

import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function LandingCustomSectionComponentSlice() {}

const actionsInitial = {
  removeOne,
  updateComponentWidth,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id" | "componentId">;

type ContextValue = [
  LandingCustomSectionComponent & { changeSpanIsDisabled: boolean },
  Actions
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

LandingCustomSectionComponentSlice.Provider =
  function LandingCustomSectionComponentProvider({
    component,
    changeSpanIsDisabled,
    children,
  }: {
    component: LandingCustomSectionComponent;
    changeSpanIsDisabled: boolean;
    children: ReactElement;
  }) {
    const { id } = component;

    const dispatch = useDispatch();

    const sharedArgs = {
      id,
    };

    const actions: Actions = {
      removeOne: () => dispatch(removeOne({ id })),
      updateComponentWidth: (args) =>
        dispatch(updateComponentWidth({ ...sharedArgs, ...args })),
    };

    return (
      <Context.Provider
        value={[{ ...component, changeSpanIsDisabled }, actions]}
      >
        {children}
      </Context.Provider>
    );
  };

LandingCustomSectionComponentSlice.useContext =
  function useLandingCustomSectionComponentContext() {
    const context = useContext(Context);
    const contextIsPopulated = checkObjectHasField(context[0]);
    if (!contextIsPopulated) {
      throw new Error(
        "useLandingCustomSectionComponentContext must be used within its provider!"
      );
    }
    return context;
  };

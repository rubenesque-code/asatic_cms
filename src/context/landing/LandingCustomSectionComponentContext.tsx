import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import {
  deleteComponentFromCustom,
  updateComponentWidth,
} from "^redux/state/landing";
import { LandingSectionCustom } from "^types/landing";

import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function LandingCustomSectionComponentSlice() {}

const actionsInitial = {
  deleteComponentFromCustom,
  updateComponentWidth,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id" | "componentId">;

type Component = LandingSectionCustom["components"][number];
type Data = Component & { changeSpanIsDisabled: boolean };
type ContextValue = [Data, Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

LandingCustomSectionComponentSlice.Provider =
  function LandingCustomSectionComponentProvider({
    component,
    changeSpanIsDisabled,
    sectionId,
    children,
  }: {
    component: Component;
    changeSpanIsDisabled: boolean;
    sectionId: string;
    children: ReactElement;
  }) {
    const { id: componentId } = component;

    const dispatch = useDispatch();

    const sharedArgs = {
      id: sectionId,
      componentId,
    };

    const actions: Actions = {
      deleteComponentFromCustom: () =>
        dispatch(deleteComponentFromCustom({ ...sharedArgs })),
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

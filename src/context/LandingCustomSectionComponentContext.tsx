import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  updateComponentWidth as updateWidthAction,
  deleteComponentFromCustom as deleteComponentAction,
} from "^redux/state/landing";

import { checkObjectHasField } from "^helpers/general";

import { LandingSectionCustomComponent } from "^types/landing";

type UpdateWidthArgs = Omit<
  Parameters<typeof updateWidthAction>[0],
  "componentId" | "sectionId"
>;

type Actions = {
  updateWidth: (args: UpdateWidthArgs) => void;
  deleteComponent: () => void;
};

type ContextValue = [section: LandingSectionCustomComponent, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const LandingCustomSectionComponentProvider = ({
  component,
  children,
  sectionId,
}: {
  component: LandingSectionCustomComponent;
  children: ReactElement;
  sectionId: string;
}) => {
  const { id: componentId } = component;

  const dispatch = useDispatch();

  const updateWidth = (args: UpdateWidthArgs) =>
    dispatch(updateWidthAction({ id: sectionId, componentId, ...args }));

  const deleteComponent = () =>
    dispatch(deleteComponentAction({ id: sectionId, componentId }));

  const value = [component, { updateWidth, deleteComponent }] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useLandingCustomSectionComponentContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error(
      "useLandingCustomSectionComponentContext must be used within its provider!"
    );
  }
  return context;
};

export {
  LandingCustomSectionComponentProvider,
  useLandingCustomSectionComponentContext,
};

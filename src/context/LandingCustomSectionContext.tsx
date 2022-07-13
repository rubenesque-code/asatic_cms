import { createContext, ReactElement, useContext } from "react";

import {
  addCustomComponent as addComponentAction,
  reorderCustomSection as reorderComponentsAction,
} from "^redux/state/landing";

import { checkObjectHasField } from "^helpers/general";

import { LandingSectionCustom } from "^types/landing";
import { useDispatch } from "^redux/hooks";

type AddComponentArgs = Omit<
  Parameters<typeof addComponentAction>[0],
  "sectionId"
>;
type ReorderComponentsArgs = Omit<
  Parameters<typeof reorderComponentsAction>[0],
  "sectionId"
>;

type Actions = {
  addComponent: (args: AddComponentArgs) => void;
  reorderComponents: (args: ReorderComponentsArgs) => void;
};

type ContextValue = [section: LandingSectionCustom, actions: Actions];
const Context = createContext<ContextValue>({} as ContextValue);

const LandingCustomSectionProvider = ({
  section,
  children,
}: {
  section: LandingSectionCustom;
  children: ReactElement;
}) => {
  const { id: sectionId } = section;

  const dispatch = useDispatch();

  const addComponent = (args: AddComponentArgs) =>
    dispatch(addComponentAction({ sectionId, ...args }));

  const reorderComponents = () => (args: ReorderComponentsArgs) =>
    dispatch(reorderComponentsAction({ sectionId, ...args }));

  const value = [section, { addComponent, reorderComponents }] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useLandingCustomSectionContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useLandingCustomSectionContext must be used within its provider!"
    );
  }
  return context;
};

export { LandingCustomSectionProvider, useLandingCustomSectionContext };

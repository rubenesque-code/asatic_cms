import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { updateText, updateDescription } from "^redux/state/collections";

import { checkObjectHasField } from "^helpers/general";

import { OmitFromMethods } from "^types/utilities";
import { CollectionTranslation } from "^types/collection";

const actionsInitial = {
  updateText,
  updateDescription,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id" | "translationId">;

type ContextValue = [translation: CollectionTranslation, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const CollectionTranslationProvider = ({
  children,
  translation,
  collectionId,
}: {
  children: ReactElement;
  translation: CollectionTranslation;
  collectionId: string;
}) => {
  const { id: translationId } = translation;

  const dispatch = useDispatch();

  const sharedArgs = {
    id: collectionId,
    translationId,
  };

  const actions: Actions = {
    updateText: (args) => dispatch(updateText({ ...sharedArgs, ...args })),
    updateDescription: (args) =>
      dispatch(updateDescription({ ...sharedArgs, ...args })),
  };

  const value = [translation, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useCollectionTranslationContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useCollectionTranslationContext must be used within its provider!"
    );
  }
  return context;
};

export { CollectionTranslationProvider, useCollectionTranslationContext };

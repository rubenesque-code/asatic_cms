import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  removeTranslation,
  updateDescription,
  updateTitle,
} from "^redux/state/collections";

import { checkObjectHasField } from "^helpers/general";

import { OmitFromMethods } from "^types/utilities";
import { CollectionTranslation } from "^types/collection";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function CollectionTranslationSlice() {}

const actionsInitial = {
  removeTranslation,
  updateTitle,
  updateDescription,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id" | "translationId">;

type ContextValue = [translation: CollectionTranslation, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

CollectionTranslationSlice.Provider = function CollectionTranslationProvider({
  children,
  translation,
  collectionId,
}: {
  children: ReactElement;
  translation: CollectionTranslation;
  collectionId: string;
}) {
  const { id: translationId } = translation;

  const dispatch = useDispatch();

  const sharedArgs = {
    id: collectionId,
    translationId,
  };

  const actions: Actions = {
    removeTranslation: () => dispatch(removeTranslation({ ...sharedArgs })),
    updateTitle: (args) => dispatch(updateTitle({ ...sharedArgs, ...args })),
    updateDescription: (args) =>
      dispatch(updateDescription({ ...sharedArgs, ...args })),
  };

  const value = [translation, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

CollectionTranslationSlice.useContext =
  function useCollectionTranslationContext() {
    const context = useContext(Context);
    const contextIsEmpty = !checkObjectHasField(context[0]);
    if (contextIsEmpty) {
      throw new Error(
        "useCollectionTranslationContext must be used within its provider!"
      );
    }
    return context;
  };

import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import {
  removeOne,
  addTranslation,
  removeSubject,
  addSubject,
} from "^redux/state/collections";

import { Collection } from "^types/collection";
import { OmitFromMethods } from "^types/utilities";

const actionsInitial = {
  addTranslation,
  removeOne,
  removeSubject,
  addSubject,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [collection: Collection, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const CollectionProvider = ({
  collection,
  children,
}: {
  collection: Collection;
  children: ReactElement;
}) => {
  const { id } = collection;

  const dispatch = useDispatch();

  const actions: Actions = {
    addTranslation: (args) => dispatch(addTranslation({ id, ...args })),
    removeOne: () => dispatch(removeOne({ id })),
    removeSubject: (args) => dispatch(removeSubject({ id, ...args })),
    addSubject: (args) => dispatch(addSubject({ id, ...args })),
  };

  return (
    <Context.Provider value={[collection, actions]}>
      {children}
    </Context.Provider>
  );
};

const useCollectionContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useCollectionContext must be used within its provider!");
  }
  return context;
};

export { CollectionProvider, useCollectionContext };

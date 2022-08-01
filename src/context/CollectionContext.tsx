import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { removeOne, addTranslation } from "^redux/state/collections";

import { Collection } from "^types/collection";
import { OmitFromMethods } from "^types/utilities";

const actionsInitial = {
  addTranslation,
  removeOne,
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
  };

  return (
    <Context.Provider value={[collection, actions]}>
      {children}
    </Context.Provider>
  );
};

const useCollectionContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useCollectionContext must be used within its provider!");
  }
  return context;
};

export { CollectionProvider, useCollectionContext };

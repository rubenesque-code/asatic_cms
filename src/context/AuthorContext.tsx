import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";
import { useDispatch } from "^redux/hooks";

import { addTranslation } from "^redux/state/authors";

import { Author } from "^types/author";
import { OmitFromMethods } from "^types/utilities";

const actionsInitial = {
  addTranslation,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [author: Author, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const AuthorProvider = ({
  author,
  children,
}: {
  author: Author;
  children: ReactElement;
}) => {
  const { id } = author;

  const dispatch = useDispatch();

  const actions: Actions = {
    addTranslation: (args) => dispatch(addTranslation({ id, ...args })),
  };

  return (
    <Context.Provider value={[author, actions]}>{children}</Context.Provider>
  );
};

const useAuthorContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useAuthorContext must be used within its provider!");
  }
  return context;
};

export { AuthorProvider, useAuthorContext };

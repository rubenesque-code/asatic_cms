import { createContext, ReactElement, useContext } from "react";
import { checkObjectHasField } from "^helpers/general";
import { useDispatch } from "^redux/hooks";

import { addTranslation, updateName } from "^redux/state/authors";

import { Author } from "^types/author";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function AuthorSlice() {}

const actionsInitial = {
  addTranslation,
  updateName,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [author: Author, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

AuthorSlice.Provider = function AuthorProvider({
  author,
  children,
}: {
  author: Author;
  children: ReactElement;
}) {
  const { id } = author;

  const dispatch = useDispatch();

  const actions: Actions = {
    addTranslation: (args) => dispatch(addTranslation({ id, ...args })),
    updateName: (args) => dispatch(updateName({ id, ...args })),
  };

  return (
    <Context.Provider value={[author, actions]}>{children}</Context.Provider>
  );
};

AuthorSlice.useContext = function useAuthorContext() {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useAuthorContext must be used within its provider!");
  }
  return context;
};

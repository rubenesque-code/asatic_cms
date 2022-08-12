import { createContext, ReactElement, useContext } from "react";

import { checkObjectHasField } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import { removeOne, updateText } from "^redux/state/tags";

import { Tag } from "^types/tag";
import { OmitFromMethods } from "^types/utilities";

const actionsInitial = {
  removeOne,
  updateText,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [tag: Tag, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const TagProvider = ({
  tag,
  children,
}: {
  tag: Tag;
  children: ReactElement;
}) => {
  const { id } = tag;

  const dispatch = useDispatch();

  const actions: Actions = {
    removeOne: () => dispatch(removeOne({ id })),
    updateText: (args) => dispatch(updateText({ id, ...args })),
  };

  return <Context.Provider value={[tag, actions]}>{children}</Context.Provider>;
};

const useTagContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error("useTagContext must be used within its provider!");
  }
  return context;
};

export { TagProvider, useTagContext };

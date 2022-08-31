import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { addTranslation, removeOne } from "^redux/state/subjects";

import { Subject } from "^types/subject";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SubjectSlice() {}

const actionsInitial = {
  addTranslation,
  removeOne,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [subject: Subject, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

SubjectSlice.Provider = function SubjectProvider({
  subject,
  children,
}: {
  subject: Subject;
  children: ReactElement;
}) {
  const { id } = subject;

  const dispatch = useDispatch();

  const actions: Actions = {
    addTranslation: (args) => dispatch(addTranslation({ id, ...args })),
    removeOne: () => dispatch(removeOne({ id })),
  };

  return (
    <Context.Provider value={[subject, actions]}>{children}</Context.Provider>
  );
};

SubjectSlice.useContext = function useSubjectContext() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSubjectContext must be used within its provider!");
  }
  return context;
};

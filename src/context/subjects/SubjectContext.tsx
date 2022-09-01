import { createContext, ReactElement, useContext } from "react";
import { mapLanguageIds } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import { addTranslation, removeOne, updateText } from "^redux/state/subjects";

import { Subject } from "^types/subject";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SubjectSlice() {}

const actionsInitial = {
  addTranslation,
  removeOne,
  updateText,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id">;

type ContextValue = [
  subject: Subject & {
    languagesIds: string[];
  },
  actions: Actions
];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

SubjectSlice.Provider = function SubjectProvider({
  subject,
  children,
}: {
  subject: Subject;
  children: ReactElement | ((contextValue: ContextValue) => ReactElement);
}) {
  const { id, translations } = subject;
  const languagesIds = mapLanguageIds(translations);

  const dispatch = useDispatch();

  const actions: Actions = {
    addTranslation: (args) => dispatch(addTranslation({ id, ...args })),
    removeOne: () => dispatch(removeOne({ id })),
    updateText: (args) => dispatch(updateText({ id, ...args })),
  };

  return (
    <Context.Provider value={[{ ...subject, languagesIds }, actions]}>
      {typeof children === "function"
        ? children([{ ...subject, languagesIds }, actions])
        : children}
    </Context.Provider>
  );
};

SubjectSlice.useContext = function useSubjectContext() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSubjectContext must be used within its provider!");
  }
  return context;
};

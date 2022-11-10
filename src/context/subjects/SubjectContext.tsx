import { createContext, ReactElement, useContext } from "react";
import { mapLanguageIds } from "^helpers/general";

import { useDispatch } from "^redux/hooks";
import {
  addTranslation,
  removeOne,
  removeTranslation,
  togglePublishStatus,
  updatePublishDate,
  updateSaveDate,
  addRelatedEntity,
  removeRelatedEntity,
} from "^redux/state/subjects";

import { Subject } from "^types/subject";
import { OmitFromMethods } from "^types/utilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SubjectSlice() {}

const actionsInitial = {
  addTranslation,
  removeOne,
  removeTranslation,
  togglePublishStatus,
  updatePublishDate,
  updateSaveDate,
  addRelatedEntity,
  removeRelatedEntity,
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
  subject: subject,
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
    removeTranslation: (args) => dispatch(removeTranslation({ id, ...args })),
    togglePublishStatus: () => dispatch(togglePublishStatus({ id })),
    updatePublishDate: (args) => dispatch(updatePublishDate({ id, ...args })),
    updateSaveDate: (args) => dispatch(updateSaveDate({ id, ...args })),
    addRelatedEntity: (args) => dispatch(addRelatedEntity({ id, ...args })),
    removeRelatedEntity: (args) =>
      dispatch(removeRelatedEntity({ id, ...args })),
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

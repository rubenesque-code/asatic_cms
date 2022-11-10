import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { removeTranslation, updateName } from "^redux/state/subjects";

import { checkObjectHasField } from "^helpers/general";

import { OmitFromMethods } from "^types/utilities";
import { SubjectTranslation } from "^types/subject";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function SubjectTranslationSlice() {}

const actionsInitial = {
  removeTranslation,
  updateName,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id" | "translationId">;

type ContextValue = [SubjectTranslation, Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

SubjectTranslationSlice.Provider = function SubjectTranslationProvider({
  children,
  translation,
  subjectId,
}: {
  children: ReactElement;
  translation: SubjectTranslation;
  subjectId: string;
}) {
  const { id: translationId } = translation;

  const dispatch = useDispatch();

  const sharedArgs = {
    id: subjectId,
    translationId,
  };

  const actions: Actions = {
    removeTranslation: () => dispatch(removeTranslation({ ...sharedArgs })),
    updateName: (args) => dispatch(updateName({ ...sharedArgs, ...args })),
  };

  const value = [translation, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

SubjectTranslationSlice.useContext = function useSubjectTranslationContext() {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useSubjectTranslationContext must be used within its provider!"
    );
  }
  return context;
};

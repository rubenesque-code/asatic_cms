import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import { updateText, removeTranslation } from "^redux/state/subjects";

import { checkObjectHasField } from "^helpers/general";

import { OmitFromMethods } from "^types/utilities";
import { SubjectTranslation } from "^types/subject";

const actionsInitial = {
  removeTranslation,
  updateText,
};

type ActionsInitial = typeof actionsInitial;

type Actions = OmitFromMethods<ActionsInitial, "id" | "translationId">;

type ContextValue = [translation: SubjectTranslation, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const SubjectTranslationProvider = ({
  children,
  translation,
  subjectId,
}: {
  children: ReactElement;
  translation: SubjectTranslation;
  subjectId: string;
}) => {
  const { id: translationId } = translation;

  const dispatch = useDispatch();

  const sharedArgs = {
    id: subjectId,
    translationId,
  };

  const actions: Actions = {
    removeTranslation: () => dispatch(removeTranslation({ ...sharedArgs })),
    updateText: (args) => dispatch(updateText({ ...sharedArgs, ...args })),
  };

  const value = [translation, actions] as ContextValue;

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useSubjectTranslationContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useSubjectTranslationContext must be used within its provider!"
    );
  }
  return context;
};

export { SubjectTranslationProvider, useSubjectTranslationContext };
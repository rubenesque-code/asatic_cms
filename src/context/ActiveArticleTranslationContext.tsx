import { createContext, ReactElement, useContext, useState } from "react";

import { checkObjectHasField } from "^helpers/general";

import { ArticleTranslation } from "^types/article";
import {
  default_language_Id,
  second_default_language_Id,
} from "^constants/data";

type Actions = {
  updateActiveTranslation: (id: string) => void;
};

type ContextValue = [activeTranslation: ArticleTranslation, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const getInitialTranslation = (translations: ArticleTranslation[]) => {
  const initialTranslationId =
    translations.find((t) => t.languageId === default_language_Id)?.id ||
    translations.find((t) => t.languageId === second_default_language_Id)?.id ||
    translations[0].id;

  return initialTranslationId;
};

const ActiveArticleTranslationProvider = ({
  children,
  translations,
}: {
  children: ReactElement;
  translations: ArticleTranslation[];
}) => {
  const [activeTranslationId, setActiveTranslationId] = useState(
    getInitialTranslation(translations)
  );

  const activeTranslation = translations.find(
    (t) => t.id === activeTranslationId
  )!;

  const updateActiveTranslation = (id: string) => {
    setActiveTranslationId(id);
  };

  return (
    <Context.Provider value={[activeTranslation, { updateActiveTranslation }]}>
      {children}
    </Context.Provider>
  );
};

const useActiveArticleTranslationContext = () => {
  const context = useContext(Context);
  const contextIsEmpty = !checkObjectHasField(context[0]);
  if (contextIsEmpty) {
    throw new Error(
      "useActiveArticleTranslationProvider must be used within its provider!"
    );
  }
  return context;
};

export { ActiveArticleTranslationProvider, useActiveArticleTranslationContext };

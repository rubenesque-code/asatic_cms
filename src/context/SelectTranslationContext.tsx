import { createContext, ReactElement, useContext, useState } from "react";

import { checkObjectHasField } from "^helpers/general";

import {
  default_language_Id,
  second_default_language_Id,
} from "^constants/data";
import { ArticleTranslation } from "^types/article";
import { RecordedEventTranslation } from "^types/recordedEvent";

type Actions = {
  updateActiveTranslation: (id: string) => void;
};

type Translation = ArticleTranslation | RecordedEventTranslation;

type ContextValue = [activeTranslation: Translation, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const getInitialTranslation = (translations: Translation[]) => {
  const initialTranslationId =
    translations.find((t) => t.languageId === default_language_Id)?.id ||
    translations.find((t) => t.languageId === second_default_language_Id)?.id ||
    translations[0].id;

  return initialTranslationId;
};

function SelectTranslationProvider({
  children,
  translations,
}: {
  children: ReactElement;
  translations: Translation[];
}) {
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
}

const useSelectTranslationContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[0]);
  if (!contextIsPopulated) {
    throw new Error(
      "useSelectTranslationContext must be used within its provider!"
    );
  }
  return context;
};

export { SelectTranslationProvider, useSelectTranslationContext };

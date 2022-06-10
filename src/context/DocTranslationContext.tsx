import {
  SetStateAction,
  createContext,
  ReactElement,
  useContext,
  useState,
  Dispatch,
} from "react";

import { DEFAULTLANGUAGEID } from "^constants/data";
import { Translation } from "^types/editable_content";

export function createDocTranslationContext<T extends Translation>() {
  type ContextValue = {
    activeTranslation: T;
    setActiveTranslationId: Dispatch<SetStateAction<string>>;
    translations: T[];
  };
  const Context = createContext<ContextValue>({} as ContextValue);

  const DocTranslationProvider = ({
    children,
    translations,
  }: {
    children: ReactElement;
    translations: T[];
  }) => {
    const initialTranslationId =
      translations.find((t) => t.languageId === DEFAULTLANGUAGEID)?.id ||
      translations[0].id;

    const [activeTranslationId, setActiveTranslationId] =
      useState(initialTranslationId);

    const activeTranslation = translations.find(
      (t) => t.id === activeTranslationId
    )!;
    console.log("activeTranslation:", activeTranslation);

    return (
      <Context.Provider
        value={{ activeTranslation, setActiveTranslationId, translations }}
      >
        {children}
      </Context.Provider>
    );
  };

  const useDocTranslationContext = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(
        "useDocTranslationContext must be used within its provider!"
      );
    }
    return context;
  };

  return {
    DocTranslationProvider,
    useDocTranslationContext,
  };
}

export type UseDocTranslationContext = ReturnType<
  typeof createDocTranslationContext
>["useDocTranslationContext"];

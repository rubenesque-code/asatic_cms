import {
  SetStateAction,
  createContext,
  ReactElement,
  useContext,
  useState,
  Dispatch,
} from "react";
import { Translation } from "^types/editable_content";

export function createDocTranslationContext<T extends Translation>() {
  type ContextValue = {
    activeTranslation: T;
    setActiveTranslationId: Dispatch<SetStateAction<string>>;
  };
  const Context = createContext<ContextValue>({} as ContextValue);

  const useDocTranslationContext = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(
        "useDocTranslationContext must be used within its provider!"
      );
    }
    return context;
  };

  const DocTranslationProvider = ({
    children,
    initialTranslationId,
    translations,
  }: {
    children: ReactElement;
    initialTranslationId: string;
    translations: T[];
  }) => {
    const [activeTranslationId, setActiveTranslationId] =
      useState(initialTranslationId);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const activeTranslation = translations.find(
      (t) => t.id === activeTranslationId
    )!;
    return (
      <Context.Provider value={{ activeTranslation, setActiveTranslationId }}>
        {children}
      </Context.Provider>
    );
  };

  return {
    DocTranslationProvider,
    useDocTranslationContext,
  };
}

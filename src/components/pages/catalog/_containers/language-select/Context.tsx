import { createContext, ReactElement, useContext, useState } from "react";
import { Language } from "^types/language";
import { default_language } from "^constants/data";

type Value = {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
};
const Context = createContext<Value>({} as Value);

function LanguageSelectProvider({ children }: { children: ReactElement }) {
  const [selectedLanguage, setSelectedLanguage] =
    useState<Language>(default_language);

  return (
    <Context.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </Context.Provider>
  );
}

function useLanguageSelectContext() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useLanguageSelectContext must be used within its provider!"
    );
  }
  return context;
}

export { LanguageSelectProvider, useLanguageSelectContext };

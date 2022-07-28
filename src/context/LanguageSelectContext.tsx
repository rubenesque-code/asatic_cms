import { createContext, ReactElement, useContext, useState } from "react";
import { Language } from "^types/language";

const allLanguagesId = "_ALL";
const allLanguagesSelectOption: Language = {
  id: allLanguagesId,
  name: "all",
};

type Value = {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
};
const Context = createContext<Value>({} as Value);
const LanguageSelectProvider = ({ children }: { children: ReactElement }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    allLanguagesSelectOption
  );

  return (
    <Context.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </Context.Provider>
  );
};

const useLanguageSelectContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useLanguageSelectContext must be used within its provider!"
    );
  }
  return context;
};

export { LanguageSelectProvider, useLanguageSelectContext };

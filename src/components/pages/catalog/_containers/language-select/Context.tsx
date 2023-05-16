import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";

import { useSelector } from "^redux/hooks";
import { selectLanguages } from "^redux/state/languages";

import {
  default_language,
  default_language_Id,
  second_default_language,
  second_default_language_Id,
} from "^constants/data";
import { Language } from "^types/language";

type Value = {
  selectedLanguage: Language | "uninitialised" | null;
  setSelectedLanguage: (language: Language) => void;
  languages: Language[];
};
const Context = createContext<Value>({} as Value);

function LanguageSelectProvider({
  children,
  excludedLanguagesIds = [],
}: {
  children: ReactElement;
  excludedLanguagesIds?: string[];
}) {
  const [selectedLanguage, setSelectedLanguage] = useState<
    Language | "uninitialised" | null
  >("uninitialised");

  const languages = useSelector(selectLanguages).filter(
    (language) => !excludedLanguagesIds.includes(language.id)
  );

  useEffect(() => {
    const isNoSelectedLanguage =
      selectedLanguage === "uninitialised" || selectedLanguage === null;
    if (!isNoSelectedLanguage) {
      return;
    }

    const initialLanguage = !excludedLanguagesIds.includes(default_language_Id)
      ? default_language
      : !excludedLanguagesIds.includes(second_default_language_Id)
      ? second_default_language
      : languages.length
      ? languages[0]
      : null;

    setSelectedLanguage(initialLanguage);
  }, [excludedLanguagesIds, languages, selectedLanguage]);

  return (
    <Context.Provider
      value={{ selectedLanguage, setSelectedLanguage, languages }}
    >
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

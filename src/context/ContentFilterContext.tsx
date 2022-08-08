import { createContext, ReactElement, useContext, useState } from "react";
import { checkObjectHasField } from "^helpers/general";
import { Language } from "^types/language";

const allLanguagesId = "_ALL";
const allLanguagesSelectOption: Language = {
  id: allLanguagesId,
  name: "all",
};

type Value = {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
  query: string;
  setQuery: (query: string) => void;
};

const Context = createContext<Value>({} as Value);

const ContentFilterProvider = ({ children }: { children: ReactElement }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    allLanguagesSelectOption
  );
  const [query, setQuery] = useState("");

  return (
    <Context.Provider
      value={{ selectedLanguage, setSelectedLanguage, query, setQuery }}
    >
      {children}
    </Context.Provider>
  );
};

const useContentFilterContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error(
      "useContentFilterContext must be used within its provider!"
    );
  }
  return context;
};

export { ContentFilterProvider, useContentFilterContext };

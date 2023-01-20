import { createContext, ReactElement, useContext, useState } from "react";

type Value = {
  selectedLanguageId: "english" | "tamil";
  setSelectedLanguageId: (languageId: "english" | "tamil") => void;
};

const Context = createContext<Value>({} as Value);

function SiteLanguageSelectProvider({ children }: { children: ReactElement }) {
  const [selectedLanguageId, setSelectedLanguageId] = useState<
    "english" | "tamil"
  >("english");

  return (
    <Context.Provider value={{ selectedLanguageId, setSelectedLanguageId }}>
      {children}
    </Context.Provider>
  );
}

function useSiteLanguageSelectContext() {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error(
      "useSiteLanguageSelectContext must be used within its provider!"
    );
  }
  return context;
}

export { SiteLanguageSelectProvider, useSiteLanguageSelectContext };

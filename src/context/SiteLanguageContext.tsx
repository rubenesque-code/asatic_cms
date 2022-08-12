import { createContext, ReactElement, useContext, useState } from "react";

import { default_language_Id } from "^constants/data";

type ContextValue = {
  siteLanguageId: string;
  setSiteLanguageId: (languageId: string) => void;
};
const Context = createContext<ContextValue>({} as ContextValue);

const SiteLanguageProvider = ({ children }: { children: ReactElement }) => {
  const [siteLanguageId, setSiteLanguageId] = useState(default_language_Id);

  return (
    <Context.Provider
      value={{
        siteLanguageId,
        setSiteLanguageId,
      }}
    >
      {children}
    </Context.Provider>
  );
};

const useSiteLanguageContext = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useSiteLanguageContext must be used within its provider!");
  }
  return context;
};

export { SiteLanguageProvider, useSiteLanguageContext };

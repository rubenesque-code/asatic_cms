import { createContext, ReactElement, useContext, useState } from "react";
import { DEFAULTLANGUAGEID } from "^constants/data";

type ActiveLanguageContextValue = {
  activeLanguageId: string;
  setActiveLanguageId: (languageId: string) => void;
};
const ActiveLanguageContext = createContext<ActiveLanguageContextValue>(
  {} as ActiveLanguageContextValue
);

const ActiveLanguageProvider = ({ children }: { children: ReactElement }) => {
  const [activeLanguageId, setActiveLanguageId] = useState(DEFAULTLANGUAGEID);

  return (
    <ActiveLanguageContext.Provider
      value={{
        activeLanguageId,
        setActiveLanguageId: (languageId: string) =>
          setActiveLanguageId(languageId),
      }}
    >
      {children}
    </ActiveLanguageContext.Provider>
  );
};

const useActiveLanguageContext = () => {
  const context = useContext(ActiveLanguageContext);
  if (context === undefined) {
    throw new Error(
      "useActiveLanguageContext must be used within its provider!"
    );
  }
  return context;
};

export { ActiveLanguageProvider, useActiveLanguageContext };

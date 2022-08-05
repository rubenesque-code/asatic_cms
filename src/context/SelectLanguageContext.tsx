import { createContext, ReactElement, useContext, useState } from "react";

import { checkObjectHasField } from "^helpers/general";

import {
  default_language_Id,
  second_default_language_Id,
} from "^constants/data";

type Actions = {
  setActiveLanguageId: (id: string) => void;
};

type ContextValue = [languageId: string, actions: Actions];
const Context = createContext<ContextValue>([{}, {}] as ContextValue);

const getInitialLanguageId = (languagesById: string[]) =>
  languagesById.includes(default_language_Id)
    ? default_language_Id
    : languagesById.includes(second_default_language_Id)
    ? second_default_language_Id
    : languagesById[0];

function SelectLanguageProvider({
  children,
  languagesById,
}: {
  children:
    | ReactElement
    | (({ activeLanguageId }: { activeLanguageId: string }) => ReactElement);
  languagesById: string[];
}) {
  const [activeLanguageId, setActiveLanguageId] = useState(
    getInitialLanguageId(languagesById)
  );

  return (
    <Context.Provider value={[activeLanguageId, { setActiveLanguageId }]}>
      {typeof children === "function"
        ? children({ activeLanguageId })
        : children}
    </Context.Provider>
  );
}

const useSelectLanguageContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context[1]);
  if (!contextIsPopulated) {
    throw new Error(
      "useSelectLanguageContext must be used within its provider!"
    );
  }
  return context;
};

export { SelectLanguageProvider, useSelectLanguageContext };

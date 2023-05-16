import {
  createContext,
  ReactElement,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
import {
  default_language_Id,
  second_default_language_Id,
} from "^constants/data";
import { checkObjectHasField } from "^helpers/general";

type ContextValue = {
  activeLanguageId: string;
  languagesIds: string[];
  updateActiveLanguage: (languageId: string) => void;
};

const Context = createContext<ContextValue>({} as ContextValue);

const EntityLanguageProvider = ({
  children,
  entity,
  parentLanguageId,
}: {
  children:
    | ReactElement
    | (({ activeLanguageId }: { activeLanguageId: string }) => ReactElement);
  entity: { languagesIds: string[] };
  parentLanguageId?: string;
}) => {
  const [activeLanguageId, setActiveLanguageId] = useState(
    getInitialLanguageId(entity.languagesIds, parentLanguageId)
  );

  useLayoutEffect(() => {
    if (entity.languagesIds.includes(activeLanguageId)) {
      return;
    }

    setActiveLanguageId(entity.languagesIds[0]);
  }, [activeLanguageId, entity.languagesIds]);

  if (!entity.languagesIds.includes(activeLanguageId)) {
    return <div>updating...</div>;
  }

  return (
    <Context.Provider
      value={{
        activeLanguageId,
        languagesIds: entity.languagesIds,
        updateActiveLanguage: setActiveLanguageId,
      }}
    >
      {typeof children === "function"
        ? children({ activeLanguageId })
        : children}
    </Context.Provider>
  );
};
const useEntityLanguageContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error(
      "useEntityLanguageContext must be used within its provider!"
    );
  }
  return context;
};

export { EntityLanguageProvider, useEntityLanguageContext };

const getInitialLanguageId = (
  languagesById: string[],
  parentLanguageId?: string
) =>
  parentLanguageId && languagesById.includes(parentLanguageId)
    ? parentLanguageId
    : languagesById.includes(default_language_Id)
    ? default_language_Id
    : languagesById.includes(second_default_language_Id)
    ? second_default_language_Id
    : languagesById[0];

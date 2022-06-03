import { createContext, ReactElement, useContext } from "react";
import { useSelector } from "^redux/hooks";
import { selectEntitiesByIds } from "^redux/state/authors";
import { selectById as selectLanguageById } from "^redux/state/languages";
import { Author } from "^types/author";

// todo: duplication of types in context props and value

export type ContextValueProps = {
  activeLanguageId: string;
  docAuthorIds: string[];
  docType: "article";
  onAddAuthorToDoc: (authorId: string) => void;
  onRemoveAuthorFromDoc: (authorId: string) => void;
};

type ContextValue = {
  // docAuthor: Author | undefined | null;
  /*   docAuthorStatus: {
    isAuthor: boolean;
    isTranslationForActiveLanguage: boolean;
  };
  docAuthorTranslationForActiveLanguage:
    | Author["translations"][number]
    | null
    | undefined; */
  activeLanguageName: string;
  docAuthors: Author[];
} & ContextValueProps;

const Context = createContext<ContextValue | null>(null);
const { Provider } = Context;

export const DocAuthorContext = ({
  children,
  docAuthorIds,
  docType,
  activeLanguageId,
  onAddAuthorToDoc,
  onRemoveAuthorFromDoc,
}: {
  children: ReactElement;
} & ContextValueProps) => {
  const docAuthors = useSelector((state) =>
    selectEntitiesByIds(state, docAuthorIds)
  );

  const activeLanguageName = useSelector((state) =>
    selectLanguageById(state, activeLanguageId)
  )!.name;
  /*   const docAuthorsTranslationData = docAuthors.map((author) => {
    const translationForActiveLanguage = author.translations.find(
      (t) => t.languageId === activeLanguageId
    );
  }); */
  /*   const docAuthorTranslationsForActiveLanguage =
    docAuthors &&
    docAuthors.translations.find((t) => t.languageId === activeLanguageId);

  const docAuthorStatus = {
    isAuthor: Boolean(docAuthors),
    isTranslationForActiveLanguage: Boolean(
      docAuthorTranslationsForActiveLanguage
    ),
  }; */

  // todo: activeLanguageId should be within author context?
  const contextValue: ContextValue = {
    activeLanguageId,
    activeLanguageName,
    docAuthors,
    // docAuthorId,
    // docAuthorStatus,
    // docAuthorTranslationForActiveLanguage:
    // docAuthorTranslationsForActiveLanguage,
    docAuthorIds,
    docType,
    onAddAuthorToDoc,
    onRemoveAuthorFromDoc,
  };

  return <Provider value={contextValue}>{children}</Provider>;
};

export const useDocAuthorContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useDocAuthorContext must be used within its provider");
  }

  return context;
};

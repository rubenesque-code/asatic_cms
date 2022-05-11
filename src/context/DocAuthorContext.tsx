import { createContext, ReactElement, useContext } from "react";
import { useSelector } from "^redux/hooks";
import { AuthorId } from "^types/editable_content";
import { selectById as selectAuthorById } from "^redux/state/authors";
import { Author } from "^types/author";

// todo: duplication of types in context props and value

export type ContextValueProps = {
  activeLanguageId: string;
  docAuthorId?: AuthorId;
  docType: "article";
  onAddAuthorToDoc: (authorId: string) => void;
  onRemoveAuthorFromDoc: () => void;
};

type ContextValue = {
  docAuthor: Author | undefined | null;
  docAuthorStatus: {
    isAuthor: boolean;
    isTranslationForActiveLanguage: boolean;
  };
  docAuthorTranslationForActiveLanguage:
    | Author["translations"][number]
    | null
    | undefined;
} & ContextValueProps;

const Context = createContext<ContextValue | null>(null);
const { Provider } = Context;

export const DocAuthorContext = ({
  children,
  docAuthorId,
  docType,
  activeLanguageId,
  onAddAuthorToDoc,
  onRemoveAuthorFromDoc,
}: {
  children: ReactElement;
} & ContextValueProps) => {
  const docAuthor = useSelector((state) =>
    docAuthorId ? selectAuthorById(state, docAuthorId) : null
  );
  const docAuthorTranslationForActiveLanguage =
    docAuthor &&
    docAuthor.translations.find((t) => t.languageId === activeLanguageId);

  const docAuthorStatus = {
    isAuthor: Boolean(docAuthor),
    isTranslationForActiveLanguage: Boolean(
      docAuthorTranslationForActiveLanguage
    ),
  };

  // todo: activeLanguageId should be within author context?
  const contextValue: ContextValue = {
    activeLanguageId,
    docAuthor,
    docAuthorId,
    docAuthorStatus,
    docAuthorTranslationForActiveLanguage,
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

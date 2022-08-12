import { createContext, ReactElement, useContext } from "react";

import { useDispatch } from "^redux/hooks";
import {
  removeTranslation,
  updateName as updateNameAction,
} from "^redux/state/authors";

import { Author } from "^types/author";

type AuthorTranslationContextValue = {
  translation: Author["translations"][number];
  updateName: (name: string) => void;
  handleDelete: () => void;
  canDelete: boolean;
};
const AuthorTranslationContext = createContext<AuthorTranslationContextValue>(
  {} as AuthorTranslationContextValue
);

const AuthorTranslationProvider = ({
  authorId,
  canDelete,
  children,
  translation,
}: {
  authorId: string;
  canDelete: boolean;
  children: ReactElement;
  translation: Author["translations"][number];
}) => {
  const dispatch = useDispatch();

  const translationId = translation.id;

  const updateName = (name: string) => {
    dispatch(updateNameAction({ id: authorId, name, translationId }));
  };
  const handleDelete = () => {
    if (canDelete) {
      dispatch(removeTranslation({ id: authorId, translationId }));
    }
  };

  return (
    <AuthorTranslationContext.Provider
      value={{ canDelete, handleDelete, updateName, translation }}
    >
      {children}
    </AuthorTranslationContext.Provider>
  );
};

const useAuthorTranslationContext = () => {
  const context = useContext(AuthorTranslationContext);
  if (context === undefined) {
    throw new Error(
      "useAuthorTranslationContext must be used within its provider!"
    );
  }
  return context;
};

export { AuthorTranslationProvider, useAuthorTranslationContext };

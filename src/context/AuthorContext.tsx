import { createContext, ReactElement, useContext } from "react";
import { Author } from "^types/author";

type AuthorContextValue = {
  author: Author;
};
const AuthorContext = createContext<AuthorContextValue>(
  {} as AuthorContextValue
);

const AuthorProvider = ({
  author,
  children,
}: {
  author: Author;
  children: ReactElement;
}) => {
  return (
    <AuthorContext.Provider value={{ author }}>
      {children}
    </AuthorContext.Provider>
  );
};

const useAuthorContext = () => {
  const context = useContext(AuthorContext);
  if (context === undefined) {
    throw new Error("useAuthorContext must be used within its provider!");
  }
  return context;
};

export { AuthorProvider, useAuthorContext };

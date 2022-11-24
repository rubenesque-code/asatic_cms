import { ReactElement } from "react";

import { useCreateArticleMutation } from "^redux/services/articles";

import { DeleteMutationProvider } from "./DeleteMutationContext";
import { WriteMutationProvider } from "^context/WriteMutationContext";

import Header from "./Header";
import Body from "./body";
import { $PageContainer } from "../../_styles";
// create new author form. name + language (language popover).
// filters
// author for each translation. add, delete, update translation. Delete author.
// - should allow delete of translation if used?
// - how to represent related document given translations
// show documents attached to author.

const AuthorsPageContent = () => {
  return (
    <$PageContainer>
      <MutationProviders>
        <>
          <Header />
          <Body />
        </>
      </MutationProviders>
    </$PageContainer>
  );
};

export default AuthorsPageContent;

const MutationProviders = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const writeMutation = useCreateArticleMutation();

  return (
    <WriteMutationProvider mutation={writeMutation}>
      <DeleteMutationProvider>
        <>{children}</>
      </DeleteMutationProvider>
    </WriteMutationProvider>
  );
};

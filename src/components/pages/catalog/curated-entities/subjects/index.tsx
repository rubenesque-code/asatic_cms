import { ReactElement } from "react";

import { useCreateSubjectMutation } from "^redux/services/subjects";

import { DeleteMutationProvider } from "./DeleteMutationContext";
import { WriteMutationProvider } from "^context/WriteMutationContext";

import Header from "./Header";
import Body from "./body";
import { $PageContainer } from "../../_styles";

const PageContent = () => {
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

export default PageContent;

const MutationProviders = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const writeMutation = useCreateSubjectMutation();

  return (
    <WriteMutationProvider mutation={writeMutation}>
      <DeleteMutationProvider>
        <>{children}</>
      </DeleteMutationProvider>
    </WriteMutationProvider>
  );
};

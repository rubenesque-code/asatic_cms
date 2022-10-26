import { ReactElement } from "react";

import {
  useCreateArticleMutation,
  useDeleteArticleMutation,
} from "^redux/services/articles";

import { DeleteMutationProvider } from "^context/DeleteMutationContext";
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
  const writeMutation = useCreateArticleMutation();
  const deleteMutation = useDeleteArticleMutation();

  return (
    <WriteMutationProvider mutation={writeMutation}>
      <DeleteMutationProvider mutation={deleteMutation}>
        <>{children}</>
      </DeleteMutationProvider>
    </WriteMutationProvider>
  );
};

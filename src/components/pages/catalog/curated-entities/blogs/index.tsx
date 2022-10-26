import { ReactElement } from "react";

import {
  useCreateBlogMutation,
  useDeleteBlogMutation,
} from "^redux/services/blogs";

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
  const writeMutation = useCreateBlogMutation();
  const deleteMutation = useDeleteBlogMutation();

  return (
    <WriteMutationProvider mutation={writeMutation}>
      <DeleteMutationProvider mutation={deleteMutation}>
        <>{children}</>
      </DeleteMutationProvider>
    </WriteMutationProvider>
  );
};

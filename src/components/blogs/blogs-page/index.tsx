import { ReactElement } from "react";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect from "^components/LanguageSelect";
import { DeleteMutationProvider } from "^context/DeleteMutationContext";
import {
  useWriteMutationContext,
  WriteMutationProvider,
} from "^context/WriteMutationContext";
import {
  useCreateBlogMutation,
  useDeleteBlogMutation,
} from "^redux/services/blogs";
import BlogsUI from "./BlogsUI";
import Header from "./Header";
import Table from "./Table";

import { $PageContainer } from "^components/display-entity/entities-page/_styles";

const BlogsPageContent = () => {
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

export default BlogsPageContent;

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

const Body = () => (
  <BlogsUI.BodySkeleton createButton={<CreateButton />}>
    <FilterProviders>
      <>
        <BlogsUI.FiltersSkeleton>
          <>
            <LanguageSelect.Select />
            <DocsQuery.InputCard />
          </>
        </BlogsUI.FiltersSkeleton>
        <Table />
      </>
    </FilterProviders>
  </BlogsUI.BodySkeleton>
);

const CreateButton = () => {
  const [writeToDb] = useWriteMutationContext();

  return <BlogsUI.CreateBlogButton onClick={writeToDb} />;
};

const FilterProviders = ({ children }: { children: ReactElement }) => {
  return (
    <DocsQuery.Provider>
      <LanguageSelect.Provider>{children}</LanguageSelect.Provider>
    </DocsQuery.Provider>
  );
};

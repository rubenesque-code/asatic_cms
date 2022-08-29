import { ReactElement } from "react";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect from "^components/LanguageSelect";
import { DeleteMutationProvider } from "^context/DeleteMutationContext";
import {
  useWriteMutationContext,
  WriteMutationProvider,
} from "^context/WriteMutationContext";
import {
  useCreateArticleMutation,
  useDeleteArticleMutation,
} from "^redux/services/articles";
import ArticlesUI from "./ArticlesUI";
import ContainersUI from "./ContainersUI";
import Header from "./Header";
import Table from "./Table";

const ArticlesPageContent = () => {
  return (
    <ContainersUI.Page>
      <MutationProviders>
        <>
          <Header />
          <Body />
        </>
      </MutationProviders>
    </ContainersUI.Page>
  );
};

export default ArticlesPageContent;

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

const Body = () => (
  <ArticlesUI.BodySkeleton createButton={<CreateButton />}>
    <FilterProviders>
      <>
        <ArticlesUI.FiltersSkeleton>
          <>
            <LanguageSelect.Select />
            <DocsQuery.InputCard />
          </>
        </ArticlesUI.FiltersSkeleton>
        <Table />
      </>
    </FilterProviders>
  </ArticlesUI.BodySkeleton>
);

const CreateButton = () => {
  const [writeToDb] = useWriteMutationContext();

  return <ArticlesUI.CreateArticleButton onClick={writeToDb} />;
};

const FilterProviders = ({ children }: { children: ReactElement }) => {
  return (
    <DocsQuery.Provider>
      <LanguageSelect.Provider>{children}</LanguageSelect.Provider>
    </DocsQuery.Provider>
  );
};

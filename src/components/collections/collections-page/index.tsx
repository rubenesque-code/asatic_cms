import {
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
} from "^redux/services/collections";

import {
  useWriteMutationContext,
  WriteMutationProvider,
} from "^context/WriteMutationContext";
import { DeleteMutationProvider } from "^context/DeleteMutationContext";

import Header from "./Header";
import { ReactElement } from "react";
import CollectionsUI from "./CollectionsUI";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect from "^components/LanguageSelect";
import ContainersUI from "./ContainersUI";
import Table from "./Table";

const PageContent = () => {
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

export default PageContent;

const MutationProviders = ({ children }: { children: ReactElement }) => {
  const writeMutation = useCreateCollectionMutation();
  const deleteMutation = useDeleteCollectionMutation();

  return (
    <WriteMutationProvider mutation={writeMutation}>
      <DeleteMutationProvider mutation={deleteMutation}>
        <>{children}</>
      </DeleteMutationProvider>
    </WriteMutationProvider>
  );
};

const Body = () => (
  <CollectionsUI.BodySkeleton createButton={<CreateButton />}>
    <FilterProviders>
      <>
        <CollectionsUI.FiltersSkeleton>
          <>
            <LanguageSelect.Select />
            <DocsQuery.InputCard />
          </>
        </CollectionsUI.FiltersSkeleton>
        <Table />
      </>
    </FilterProviders>
  </CollectionsUI.BodySkeleton>
);

const CreateButton = () => {
  const [writeToDb] = useWriteMutationContext();

  return <CollectionsUI.CreateButton onClick={writeToDb} />;
};

const FilterProviders = ({ children }: { children: ReactElement }) => {
  return (
    <DocsQuery.Provider>
      <LanguageSelect.Provider>{children}</LanguageSelect.Provider>
    </DocsQuery.Provider>
  );
};

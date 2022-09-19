import { ReactElement } from "react";

import {
  useCreateRecordedEventMutation,
  useDeleteRecordedEventMutation,
} from "^redux/services/recordedEvents";

import { DeleteMutationProvider } from "^context/DeleteMutationContext";
import {
  useWriteMutationContext,
  WriteMutationProvider,
} from "^context/WriteMutationContext";

import RecordedEventsUI from "./RecordedEventsUI";
import ContainersUI from "./ContainersUI";
import Header from "./Header";
import Table from "./Table";

import DocsQuery from "^components/DocsQuery";
import LanguageSelect from "^components/LanguageSelect";

const RecordedEventsPageContent = () => {
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

export default RecordedEventsPageContent;

const MutationProviders = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const writeMutation = useCreateRecordedEventMutation();
  const deleteMutation = useDeleteRecordedEventMutation();

  return (
    <WriteMutationProvider mutation={writeMutation}>
      <DeleteMutationProvider mutation={deleteMutation}>
        <>{children}</>
      </DeleteMutationProvider>
    </WriteMutationProvider>
  );
};

const Body = () => (
  <RecordedEventsUI.BodySkeleton createButton={<CreateButton />}>
    <FilterProviders>
      <>
        <RecordedEventsUI.FiltersSkeleton>
          <>
            <LanguageSelect.Select />
            <DocsQuery.InputCard />
          </>
        </RecordedEventsUI.FiltersSkeleton>
        <Table />
      </>
    </FilterProviders>
  </RecordedEventsUI.BodySkeleton>
);

const CreateButton = () => {
  const [writeToDb] = useWriteMutationContext();

  return <RecordedEventsUI.CreateButton onClick={writeToDb} />;
};

const FilterProviders = ({ children }: { children: ReactElement }) => {
  return (
    <DocsQuery.Provider>
      <LanguageSelect.Provider>{children}</LanguageSelect.Provider>
    </DocsQuery.Provider>
  );
};

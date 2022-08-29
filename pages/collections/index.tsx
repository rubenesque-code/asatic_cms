import { NextPage } from "next";

import { Collection as CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import { useDispatch } from "^redux/hooks";
import { addOne } from "^redux/state/collections";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import { ReactElement } from "react";
import {
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
} from "^redux/services/collections";
import {
  useWriteMutationContext,
  WriteMutationProvider,
} from "^context/WriteMutationContext";
import {
  DeleteMutationProvider,
  useDeleteMutationContext,
} from "^context/DeleteMutationContext";
import MutationTextUI from "^components/display-content-items-page/MutationTextUI";
import useMutationText from "^hooks/useMutationText";
import { HeaderGeneric } from "^components/header/Header";

const CollectionsPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          CollectionKey.ARTICLES,
          CollectionKey.AUTHORS,
          CollectionKey.COLLECTIONS,
          CollectionKey.LANGUAGES,
          CollectionKey.SUBJECTS,
          CollectionKey.TAGS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default CollectionsPage;

const PageContent = () => {
  return (
    <MutationProviders>
      <>
        <Header />
        <div>
          <CreateCollectionButton />
        </div>
      </>
    </MutationProviders>
  );
};

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

const Header = () => {
  return <HeaderGeneric leftElements={<MutationText />} />;
};

const MutationText = () => {
  const [, createMutationData] = useWriteMutationContext();
  const [, deleteMutationData] = useDeleteMutationContext();

  const { isError, isLoading, isSuccess, mutationType } = useMutationText({
    createMutationData,
    deleteMutationData,
  });

  return (
    <MutationTextUI
      mutationData={{ isError, isLoading, isSuccess }}
      mutationType={mutationType}
    />
  );
};

const CreateCollectionButton = () => {
  const [writeToDb] = useWriteMutationContext();

  return <button onClick={writeToDb}>Add collection</button>;
};

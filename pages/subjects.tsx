import { NextPage } from "next";
import tw from "twin.macro";

import { Collection as CollectionKeys } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";

const CollectionsPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          CollectionKeys.ARTICLES,
          CollectionKeys.BLOGS,
          CollectionKeys.LANGUAGES,
          CollectionKeys.RECORDEDEVENTS,
          CollectionKeys.SUBJECTS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default CollectionsPage;

const PageContent = () => {
  return <div css={[tw`min-h-screen flex-col gap-lg`]}>SUBJECTS</div>;
};

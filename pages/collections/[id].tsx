import { NextPage } from "next";

import { Collection as CollectionKey } from "^lib/firebase/firestore/collectionKeys";
o;
import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import HeaderGeneric from "^components/header/HeaderGeneric2";

const CollectionPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          CollectionKey.ARTICLES,
          CollectionKey.AUTHORS,
          CollectionKey.BLOGS,
          CollectionKey.COLLECTIONS,
          CollectionKey.IMAGES,
          CollectionKey.LANGUAGES,
          CollectionKey.RECORDEDEVENTS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default CollectionPage;

const PageContent = () => <Header />;

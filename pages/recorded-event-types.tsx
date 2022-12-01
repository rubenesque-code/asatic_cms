import type { NextPage } from "next";

import { CollectionKey as CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import PageContent from "^components/pages/catalog/sub-entities/recorded-event-types";

const AuthorsPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          CollectionKey.RECORDEDEVENTTYPES,
          CollectionKey.LANGUAGES,
          CollectionKey.RECORDEDEVENTS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default AuthorsPage;

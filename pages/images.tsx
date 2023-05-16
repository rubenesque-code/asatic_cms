import type { NextPage } from "next";

import { CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import PageContent from "^components/pages/catalog/sub-entities/images";

const ImagesPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          CollectionKey.IMAGES,
          CollectionKey.ARTICLES,
          CollectionKey.BLOGS,
          CollectionKey.COLLECTIONS,
          CollectionKey.LANDING,
          CollectionKey.RECORDEDEVENTS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default ImagesPage;

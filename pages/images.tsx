import type { NextPage } from "next";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import PageContent from "^components/pages/catalog/sub-entities/images";

const ImagesPage: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.IMAGES,
          Collection.ARTICLES,
          Collection.BLOGS,
          Collection.COLLECTIONS,
          Collection.LANDING,
          Collection.RECORDEDEVENTS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default ImagesPage;

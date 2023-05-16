import { NextPage } from "next";

import { CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import PageContent from "^curated-pages/about";

const About: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[CollectionKey.ABOUT, CollectionKey.LANGUAGES]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default About;

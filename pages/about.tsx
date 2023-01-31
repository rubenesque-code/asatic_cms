import { NextPage } from "next";

import { CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import PageContent from "^curated-pages/collection-of-documents/landing";

const About: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase collections={[CollectionKey.ABOUT]}>
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default About;

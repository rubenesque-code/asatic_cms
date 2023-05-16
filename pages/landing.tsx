import { NextPage } from "next";
import React from "react";

import { CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import PageContent from "^curated-pages/collection-of-documents/landing";

const Landing: NextPage = () => {
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
          CollectionKey.LANDING,
          CollectionKey.LANGUAGES,
          CollectionKey.SUBJECTS,
          CollectionKey.RECORDEDEVENTS,
          CollectionKey.RECORDEDEVENTTYPES,
          CollectionKey.TAGS,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default Landing;

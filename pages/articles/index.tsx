import type { NextPage } from "next";

import { Collection as CollectionKey } from "^lib/firebase/firestore/collectionKeys";

import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import ArticlesPageContent from "^components/articles/articles-page";

const ArticlesPage: NextPage = () => {
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
        <ArticlesPageContent />
      </QueryDatabase>
    </>
  );
};

export default ArticlesPage;

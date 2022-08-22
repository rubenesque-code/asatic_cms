import { NextPage } from "next";
import tw from "twin.macro";

import { Collection as CollectionKey } from "^lib/firebase/firestore/collectionKeys";
import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import HandleRouteValidity from "^components/primary-content-item-page/HandleRouteValidity";
import Header from "^components/collections/item-page/Header";

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
        <HandleRouteValidity docType="collection">
          <PageContent />
        </HandleRouteValidity>
      </QueryDatabase>
    </>
  );
};

export default CollectionPage;

const PageContent = () => {
  return (
    <div css={[tw`h-screen overflow-hidden flex flex-col`]}>
      <Header
        isChange={true}
        save={() => null}
        saveMutationData={{
          isError: false,
          isLoading: false,
          isSuccess: false,
        }}
        undo={() => null}
      />
    </div>
  );
};

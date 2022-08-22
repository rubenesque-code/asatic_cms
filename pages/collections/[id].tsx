import { NextPage } from "next";
import tw from "twin.macro";

import { Collection as CollectionKey } from "^lib/firebase/firestore/collectionKeys";
import Head from "^components/Head";
import QueryDatabase from "^components/QueryDatabase";
import HandleRouteValidity from "^components/primary-content-item-page/HandleRouteValidity";
import Header from "^components/collections/item-page/Header";
import SiteLanguage from "^components/SiteLanguage";
import { CollectionProvider } from "^context/collections/CollectionContext";
import { ReactElement } from "react";
import { Collection } from "^types/collection";
import useGetSubRouteId from "^hooks/useGetSubRouteId";
import { useSelector } from "^redux/hooks";
import { selectById } from "^redux/state/collections";

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
  const id = useGetSubRouteId();
  const collection = useSelector((state) => selectById(state, id))!;

  return (
    <div css={[tw`h-screen overflow-hidden flex flex-col`]}>
      <Providers collection={collection}>
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
      </Providers>
    </div>
  );
};

const Providers = ({
  children,
  collection,
}: {
  children: ReactElement;
  collection: Collection;
}) => (
  <SiteLanguage.Provider>
    <CollectionProvider collection={collection}>{children}</CollectionProvider>
  </SiteLanguage.Provider>
);

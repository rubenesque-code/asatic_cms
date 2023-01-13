import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import CollectionProvidersWithOwnLanguages from "^components/_containers/collections/ProvidersWithOwnLanguages";
import { $PageContainer } from "../_styles";
import $Canvas_ from "../_presentation/$Canvas_";
import Header from "./Header";
import Document from "./document";

const CollectionPage = () => {
  const collectionId = useGetSubRouteId();
  const collection = useSelector((state) =>
    selectCollectionById(state, collectionId)
  )!;

  return (
    <$PageContainer>
      <CollectionProvidersWithOwnLanguages recordedEvent={collection}>
        <>
          <Header />
          <$Canvas_ maxWidth={false} usePadding={false}>
            <>
              <Document />
            </>
          </$Canvas_>
        </>
      </CollectionProvidersWithOwnLanguages>
    </$PageContainer>
  );
};

export default CollectionPage;

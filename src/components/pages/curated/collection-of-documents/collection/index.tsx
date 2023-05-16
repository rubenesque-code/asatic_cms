import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { $PageContainer } from "../_styles/$page";
import { $CanvasDefault_ } from "../../_presentation/$Canvas_";
import Header from "./Header";
import Document from "./document";
import CollectionSlice from "^context/collections/CollectionContext";

const CollectionPage = () => {
  const collectionId = useGetSubRouteId();
  const collection = useSelector((state) =>
    selectCollectionById(state, collectionId)
  )!;

  return (
    <$PageContainer>
      <CollectionSlice.Provider collection={collection}>
        <>
          <Header />
          <$CanvasDefault_ maxWidth={false} usePadding={false}>
            <>
              <Document />
            </>
          </$CanvasDefault_>
        </>
      </CollectionSlice.Provider>
    </$PageContainer>
  );
};

export default CollectionPage;

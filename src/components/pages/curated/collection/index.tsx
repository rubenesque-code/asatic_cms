import { useDeleteCollectionMutation } from "^redux/services/collections";

import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import { DeleteMutationProvider } from "^context/DeleteMutationContext";

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

  const deleteMutation = useDeleteCollectionMutation();

  return (
    <$PageContainer>
      <CollectionProvidersWithOwnLanguages collection={collection}>
        <DeleteMutationProvider mutation={deleteMutation}>
          <>
            <Header />
            <$Canvas_ maxWidth={false} usePadding={false}>
              <>
                <Document />
              </>
            </$Canvas_>
          </>
        </DeleteMutationProvider>
      </CollectionProvidersWithOwnLanguages>
    </$PageContainer>
  );
};

export default CollectionPage;

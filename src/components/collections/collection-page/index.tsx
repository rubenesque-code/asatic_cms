import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";

import { DeleteMutationProvider } from "^context/DeleteMutationContext";
import { useDeleteCollectionMutation } from "^redux/services/collections";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import ProvidersWithTranslationLanguages from "../ProvidersWithTranslationLanguages";

import Canvas from "^components/display-entity/entity-page/_presentation/$Canvas_";
import ContainersUI from "^components/article-like/entity-page/ContainersUI";

import Header from "./Header";
import Collection from "./collection";

const CollectionPageContent = () => {
  return (
    <ContainersUI.ScreenHeight>
      <ColectionProviders>
        <MutationProviders>
          <>
            <Header />
            <Canvas usePadding={false} maxWidth={false}>
              <Collection />
            </Canvas>
          </>
        </MutationProviders>
      </ColectionProviders>
    </ContainersUI.ScreenHeight>
  );
};

export default CollectionPageContent;

const ColectionProviders = ({ children }: { children: ReactElement }) => {
  const collectionId = useGetSubRouteId();
  const collection = useSelector((state) =>
    selectCollectionById(state, collectionId)
  )!;

  return (
    <ProvidersWithTranslationLanguages collection={collection}>
      {children}
    </ProvidersWithTranslationLanguages>
  );
};

const MutationProviders = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const deleteMutation = useDeleteCollectionMutation();

  return (
    <DeleteMutationProvider mutation={deleteMutation}>
      <>{children}</>
    </DeleteMutationProvider>
  );
};

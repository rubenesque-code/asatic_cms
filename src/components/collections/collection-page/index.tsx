import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectCollectionById } from "^redux/state/collections";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import ProvidersWithTranslationLanguages from "../ProvidersWithTranslationLanguages";

import Canvas from "^components/display-content/entity-page/Canvas";
import ContainersUI from "^components/article-like/entity-page/ContainersUI";

import Header from "./Header";
import Collection from "./collection";

const ArticlePageContent = () => {
  return (
    <ContainersUI.ScreenHeight>
      <ColectionProviders>
        <>
          <Header />
          <Canvas usePadding={false} useMaxWidth={false}>
            <>
              <Collection />
            </>
          </Canvas>
        </>
      </ColectionProviders>
    </ContainersUI.ScreenHeight>
  );
};

export default ArticlePageContent;

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

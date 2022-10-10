import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectRecordedEventById } from "^redux/state/recordedEvents";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import ProvidersWithTranslationLanguages from "../ProvidersWithTranslationLanguages";

import Canvas from "^components/display-entity/entity-page/Canvas";
import { ArticleTypeWatermark } from "^components/display-entity/entity-page/styles";

import Header from "./Header";
import Article from "./article";
import { PageContainer } from "./styles";

const PageContent = () => {
  return (
    <PageContainer>
      <RecordedEventProviders>
        <>
          <Header />
          <Canvas>
            <>
              {<Article />}
              <ArticleTypeWatermark>Recorded Event</ArticleTypeWatermark>
            </>
          </Canvas>
        </>
      </RecordedEventProviders>
    </PageContainer>
  );
};

export default PageContent;

const RecordedEventProviders = ({ children }: { children: ReactElement }) => {
  const recordedEventId = useGetSubRouteId();
  const recordedEvent = useSelector((state) =>
    selectRecordedEventById(state, recordedEventId)
  )!;

  return (
    <ProvidersWithTranslationLanguages recordedEvent={recordedEvent}>
      {children}
    </ProvidersWithTranslationLanguages>
  );
};

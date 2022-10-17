import { ReactElement } from "react";

import { useSelector } from "^redux/hooks";
import { selectRecordedEventById } from "^redux/state/recordedEvents";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import ProvidersWithTranslationLanguages from "../ProvidersWithTranslationLanguages";
import { DeleteMutationProvider } from "^context/DeleteMutationContext";

import Canvas from "^components/display-entity/entity-page/Canvas";
import { ArticleTypeWatermark } from "^components/display-entity/entity-page/styles";

import Header from "./Header";
import Article from "./article";
import { PageContainer } from "./styles";
import { useDeleteRecordedEventMutation } from "^redux/services/recordedEvents";
import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

const PageContent = () => {
  return (
    <PageContainer>
      <RecordedEventProviders>
        <MutationProviders>
          <>
            <Header />
            <Canvas>
              <>
                {<Article />}
                <ArticleTypeWatermark>Recorded Event</ArticleTypeWatermark>
              </>
            </Canvas>
          </>
        </MutationProviders>
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

const MutationProviders = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const [{ id }] = RecordedEventSlice.useContext();
  const deleteMutation = useDeleteRecordedEventMutation();

  return (
    <DeleteMutationProvider
      mutation={[() => deleteMutation[0]({ id }), deleteMutation[1]]}
    >
      <>{children}</>
    </DeleteMutationProvider>
  );
};

/* const DeleteOverlay = () => {
  const [isClosed, setIsClosed] = useState<null | true>(null);

  const [, { isLoading, isSuccess }] = useDeleteMutationContext();

  if (!isLoading || isClosed) {
    return null;
  }

  return (
    <div css={[tw`fixed inset-0 bg-white opacity-50 grid place-items-center`]}>
      <div>
        {isLoading ? (
          <p css={[tw`font-mono`]}>Deleting document...</p>
        ) : isSuccess ? (
          <div>Deleted</div>
        ) : (
          <div>
            <p>There was an error deleting this document</p>
            <button
              css={[tw`border px-1.5 py-1`]}
              onClick={() => setIsClosed(true)}
            >
              Okay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
 */

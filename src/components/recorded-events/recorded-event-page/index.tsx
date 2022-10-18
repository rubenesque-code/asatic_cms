import { ReactElement } from "react";

import { useDeleteRecordedEventMutation } from "^redux/services/recordedEvents";
import { useSelector } from "^redux/hooks";
import { selectRecordedEventById } from "^redux/state/recordedEvents";

import ProvidersWithTranslationLanguages from "../ProvidersWithTranslationLanguages";
import { DeleteMutationProvider } from "^context/DeleteMutationContext";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import {
  $PageContainer,
  $EntityTypeWatermark,
} from "^components/display-entity/entity-page/_styles";
import Header from "./Header";
import Article from "./article";
import StickyCanvas_ from "^components/display-entity/entity-page/_containers/StickyCanvas_";

const PageContent = () => {
  return (
    <$PageContainer>
      <RecordedEventProviders>
        <MutationProviders>
          <>
            <Header />
            <StickyCanvas_>
              <>
                <Article />
                <$EntityTypeWatermark>Video Document</$EntityTypeWatermark>
              </>
            </StickyCanvas_>
          </>
        </MutationProviders>
      </RecordedEventProviders>
    </$PageContainer>
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
  const deleteMutation = useDeleteRecordedEventMutation();

  return (
    <DeleteMutationProvider mutation={deleteMutation}>
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

import { useSelector } from "^redux/hooks";
import { selectRecordedEventById } from "^redux/state/recordedEvents";

import useGetSubRouteId from "^hooks/useGetSubRouteId";

import RecordedEventProvidersWithOwnLanguages from "^components/_containers/recorded-events/ProvidersWithOwnLanguages";
import { $PageContainer, $EntityTypeWatermark } from "../_styles";
import StickyCanvas_ from "../_containers/StickyCanvas_";
import Header from "./Header";
import Document from "./document";

const RecordedEventPage = () => {
  const recordedEventId = useGetSubRouteId();
  const recordedEvent = useSelector((state) =>
    selectRecordedEventById(state, recordedEventId)
  )!;

  return (
    <$PageContainer>
      <RecordedEventProvidersWithOwnLanguages recordedEvent={recordedEvent}>
        <>
          <Header />
          <StickyCanvas_>
            <>
              <Document />
              <$EntityTypeWatermark>Video document</$EntityTypeWatermark>
            </>
          </StickyCanvas_>
        </>
      </RecordedEventProvidersWithOwnLanguages>
    </$PageContainer>
  );
};

export default RecordedEventPage;

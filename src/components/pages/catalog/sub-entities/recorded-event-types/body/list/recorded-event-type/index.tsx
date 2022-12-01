import { useDispatch } from "^redux/hooks";
import { removeOne as removeRecordedEventType } from "^redux/state/recordedEventsTypes";

import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

import useUpdateStoreRelatedEntitiesOnDelete from "^hooks/recorded-events-types/useUpdateStoreRelatedEntitiesOnDelete";

import { RecordedEventType as RecordedEventTypeType } from "^types/recordedEventType";

import RelatedDocumentsSection from "./related-documents";
import TranslationsSection from "./translations";
import { $Entity } from "^catalog-pages/_presentation";

const RecordedEventType = ({
  recordedEventType,
}: {
  recordedEventType: RecordedEventTypeType;
}) => {
  return (
    <RecordedEventTypeSlice.Provider recordedEventType={recordedEventType}>
      <Content />
    </RecordedEventTypeSlice.Provider>
  );
};

export default RecordedEventType;

const Content = () => {
  const [{ id: authorId }] = RecordedEventTypeSlice.useContext();

  const dispatch = useDispatch();

  const updateStoreRelatedEntitiesOnDelete =
    useUpdateStoreRelatedEntitiesOnDelete();

  const handleDelete = () => {
    dispatch(removeRecordedEventType({ id: authorId }));
    updateStoreRelatedEntitiesOnDelete();
  };

  return (
    <$Entity
      deleteEntity={handleDelete}
      entityName="recordedEventType"
      relatedDocuments={<RelatedDocumentsSection />}
      entityText={<TranslationsSection />}
    />
  );
};

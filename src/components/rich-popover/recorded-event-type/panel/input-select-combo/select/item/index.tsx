import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

import { $SelectEntity_ } from "^components/rich-popover/_presentation/SelectEntities";
import { Translation_ } from "^components/rich-popover/_containers/SelectEntity";

const Item = () => {
  const [, { updateType }] = RecordedEventSlice.useContext();
  const [{ id: typeId }] = RecordedEventTypeSlice.useContext();

  const [{ translations }] = RecordedEventTypeSlice.useContext();

  const processed = translations.filter((t) => t.name.length);

  return (
    <$SelectEntity_
      addEntityToParent={() => updateType({ typeId })}
      entityType="video type"
      parentType="video document"
      addToParentText="Update video document type"
    >
      {processed.map((translation) => (
        <Translation_
          languageId={translation.languageId}
          text={translation.name}
          key={translation.id}
        />
      ))}
    </$SelectEntity_>
  );
};

export default Item;

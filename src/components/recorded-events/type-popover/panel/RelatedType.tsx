import { useSelector } from "^redux/hooks";
import { selectRecordedEventTypeById } from "^redux/state/recordedEventsTypes";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

import useRecordedEventTypeTranslationsForRecordedEvent from "^hooks/recorded-events-types/useRecordedEventTypeTranslationsForRecordedEvent";

import InlineTextEditor from "^components/editors/Inline";
import { Translation_ } from "./_containers/RelatedEntity";
import {
  $MissingTranslation,
  $MissingEntity,
  $Entity,
} from "./_presentation/RelatedEntity";
import { $Container, $TranslationText } from "./_styles/relatedEntity";

const RelatedType = () => {
  const [{ recordedEventTypeId }] = RecordedEventSlice.useContext();

  const recordedEventType = useSelector((state) =>
    selectRecordedEventTypeById(state, recordedEventTypeId || "")
  );

  if (!recordedEventTypeId) {
    return null;
  }

  return (
    <$Container>
      {!recordedEventType ? (
        <$MissingEntity entityType="video type" />
      ) : (
        <RecordedEventTypeSlice.Provider recordedEventType={recordedEventType}>
          <Found />
        </RecordedEventTypeSlice.Provider>
      )}
    </$Container>
  );
};

export default RelatedType;

const Found = () => {
  const { activeLanguagesIds, inactiveTranslations } =
    useRecordedEventTypeTranslationsForRecordedEvent();

  return (
    <$Entity
      activeTranslations={activeLanguagesIds.map((languageId) => (
        <Translation_ languageId={languageId} type="active" key={languageId}>
          <ActiveTranslationText languageId={languageId} />
        </Translation_>
      ))}
      inactiveTranslations={inactiveTranslations.map((translation) => (
        <Translation_
          languageId={translation.languageId}
          type="inactive"
          key={translation.id}
        >
          <$TranslationText>{translation.name}</$TranslationText>
        </Translation_>
      ))}
    />
  );
};

const ActiveTranslationText = ({ languageId }: { languageId: string }) => {
  const [{ translations }, { addTranslation, updateName }] =
    RecordedEventTypeSlice.useContext();

  const translation = translations.find(
    (translation) => translation.languageId === languageId
  );

  const handleUpdateName = (name: string) => {
    if (translation) {
      updateName({ name, translationId: translation.id });
    } else {
      addTranslation({ languageId, name });
    }
  };

  return (
    <$TranslationText>
      <InlineTextEditor
        injectedValue={translation?.name || ""}
        onUpdate={handleUpdateName}
        placeholder=""
      >
        {!translation?.name.length ? () => <$MissingTranslation /> : null}
      </InlineTextEditor>
    </$TranslationText>
  );
};

import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

import useRecordedEventTypeTranslationsForRecordedEvent from "^hooks/recorded-events-types/useTranslationsForRecordedEvent";

import InlineTextEditor from "^components/editors/Inline";
import { Translation_ } from "../../_containers/RelatedEntity";
import {
  $MissingTranslation,
  $Entity,
} from "../../_presentation/RelatedEntity";
import { $TranslationText } from "../../_styles/relatedEntity";

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

export default Found;

import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

import useRecordedEventTypeTranslationsForRecordedEvent from "^hooks/recorded-events-types/useTranslationsForRecordedEvent";

import InlineTextEditor from "^components/editors/Inline";
import {
  $EntityTranslations,
  $MissingTranslationText,
} from "^components/rich-popover/_presentation/RelatedEntities";
import { $TranslationText } from "^components/rich-popover/_styles/relatedEntities";

import { Translation_ } from "^components/rich-popover/_containers/RelatedEntity";

const Found = () => {
  const { activeLanguagesIds, inactiveTranslations } =
    useRecordedEventTypeTranslationsForRecordedEvent();
  console.log("activeLanguagesIds:", activeLanguagesIds);
  console.log("inactiveTranslations:", inactiveTranslations);

  return (
    <$EntityTranslations
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
  console.log("translations:", translations);

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
        {!translation?.name?.length ? () => <$MissingTranslationText /> : null}
      </InlineTextEditor>
    </$TranslationText>
  );
};

export default Found;

import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

import { useIsTranslationUsed } from "^hooks/recorded-events-types/useIsTranslationUsed";

import { $EntityTranslation_ } from "^catalog-pages/_presentation";
import { RecordedEventTypeTranslation } from "^types/recordedEventType";

const Translation = ({
  translation,
}: {
  translation: RecordedEventTypeTranslation;
}) => {
  const [{ translations }, { updateName, removeTranslation }] =
    RecordedEventTypeSlice.useContext();

  const translationIsUsed = useIsTranslationUsed(translation);

  const canDeleteTranslation = !translationIsUsed && translations.length > 1;

  return (
    <$EntityTranslation_
      canDelete={canDeleteTranslation}
      languageId={translation.languageId}
      remove={() => removeTranslation({ translationId: translation.id })}
      text={translation.name}
      updateText={(name) => updateName({ name, translationId: translation.id })}
    />
  );
};

export default Translation;

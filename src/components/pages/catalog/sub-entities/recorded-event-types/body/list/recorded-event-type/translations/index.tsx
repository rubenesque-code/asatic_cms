import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

import { $EntityTranslationsSection_ } from "^catalog-pages/_presentation";
import AddOne from "./AddOne";
import Translation from "./translation";

const TranslationsSection = () => {
  const [{ translations }] = RecordedEventTypeSlice.useContext();

  return (
    <$EntityTranslationsSection_ addTranslationPopover={<AddOne />}>
      {translations.map((translation) => (
        <Translation translation={translation} key={translation.id} />
      ))}
    </$EntityTranslationsSection_>
  );
};

export default TranslationsSection;

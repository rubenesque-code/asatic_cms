import RecordedEventTypeSlice from "^context/recorded-event-types/RecordedEventTypeContext";

import { AddTranslation } from "^catalog-pages/_containers";

const AddOne = () => {
  const [{ languagesIds }, { addTranslation }] =
    RecordedEventTypeSlice.useContext();

  return (
    <AddTranslation
      addTranslation={({ languageId, text }) =>
        addTranslation({ languageId, name: text })
      }
      excludedLanguagesIds={languagesIds}
      translationTextKey="name"
    />
  );
};

export default AddOne;

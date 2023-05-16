import AuthorSlice from "^context/authors/AuthorContext";

import { AddTranslation } from "^catalog-pages/_containers";

const AddOne = () => {
  const [{ languagesIds }, { addTranslation }] = AuthorSlice.useContext();

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

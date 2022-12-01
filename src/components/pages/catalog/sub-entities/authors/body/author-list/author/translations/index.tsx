import AuthorSlice from "^context/authors/AuthorContext";

import { $EntityTranslationsSection_ } from "^catalog-pages/_presentation";
import AddOne from "./AddOne";
import Translation from "./translation";

const TranslationsSection = () => {
  const [{ translations }] = AuthorSlice.useContext();

  return (
    <$EntityTranslationsSection_ addTranslationPopover={<AddOne />}>
      {translations.map((translation) => (
        <Translation translation={translation} key={translation.id} />
      ))}
    </$EntityTranslationsSection_>
  );
};

export default TranslationsSection;

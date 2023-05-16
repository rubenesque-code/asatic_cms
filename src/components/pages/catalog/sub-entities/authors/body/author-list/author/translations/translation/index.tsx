import AuthorSlice from "^context/authors/AuthorContext";

import { useIsAuthorTranslationUsed } from "^hooks/authors/useIsAuthorTranslationUsed";

import { AuthorTranslation } from "^types/author";

import { $EntityTranslation_ } from "^catalog-pages/_presentation";

const Translation = ({ translation }: { translation: AuthorTranslation }) => {
  const [{ translations }, { updateName, removeTranslation }] =
    AuthorSlice.useContext();

  const authorTranslationIsUsed = useIsAuthorTranslationUsed(translation);

  const canDeleteTranslation =
    !authorTranslationIsUsed && translations.length > 1;

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

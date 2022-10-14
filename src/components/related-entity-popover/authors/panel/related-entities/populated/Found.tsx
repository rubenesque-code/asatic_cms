import AuthorSlice from "^context/authors/AuthorContext";
import { arrayDivergence, sortStringsByLookup } from "^helpers/general";

import InlineTextEditor from "^components/editors/Inline";
import {
  $Entity,
  $MissingTranslationText,
} from "^components/related-entity-popover/_presentation/RelatedEntities";
import { $TranslationText } from "^components/related-entity-popover/_styles/relatedEntities";
import { Translation_ } from "^components/related-entity-popover/_containers/RelatedEntity";

import { useComponentContext } from "../../../Context";

const Found = () => {
  const [{ activeLanguageId, parentLanguagesIds }] = useComponentContext();
  const [
    { languagesIds: authorLanguagesIds, translations: authorTranslations },
  ] = AuthorSlice.useContext();

  const activeLanguagesIds = sortStringsByLookup(
    activeLanguageId,
    parentLanguagesIds
  );

  const inactiveAuthorTranslations = arrayDivergence(
    authorLanguagesIds,
    activeLanguagesIds
  ).map(
    (languageId) => authorTranslations.find((a) => a.languageId === languageId)!
  );

  return (
    <$Entity
      activeTranslations={activeLanguagesIds.map((languageId) => (
        <Translation_ languageId={languageId} type="active" key={languageId}>
          <ActiveTranslationText languageId={languageId} />
        </Translation_>
      ))}
      inactiveTranslations={inactiveAuthorTranslations.map((translation) => (
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
    AuthorSlice.useContext();

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
        {!translation?.name.length ? () => <$MissingTranslationText /> : null}
      </InlineTextEditor>
    </$TranslationText>
  );
};

export default Found;

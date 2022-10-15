import SubjectSlice from "^context/subjects/SubjectContext";
import { useComponentContext } from "../../../Context";

import {
  getInactiveTranslationsOfChildEntity,
  sortStringsByLookup,
} from "^helpers/general";

import InlineTextEditor from "^components/editors/Inline";
import {
  $Entity,
  $MissingTranslationText,
} from "^components/related-entity-popover/_presentation/RelatedEntities";
import { $TranslationText } from "^components/related-entity-popover/_styles/relatedEntities";
import { Translation_ } from "^components/related-entity-popover/_containers/RelatedEntity";

const Found = () => {
  const [
    { activeLanguageId, parentLanguagesIds, parentType },
    { removeSubjectFromParent },
  ] = useComponentContext();
  const [{ id: subjectId, translations: subjectTranslations }] =
    SubjectSlice.useContext();

  const activeLanguagesIds = sortStringsByLookup(
    activeLanguageId,
    parentLanguagesIds
  );

  const inactiveSubjectTranslations = getInactiveTranslationsOfChildEntity(
    parentLanguagesIds,
    subjectTranslations
  );

  return (
    <$Entity
      activeTranslations={activeLanguagesIds.map((languageId) => (
        <Translation_ languageId={languageId} type="active" key={languageId}>
          <ActiveTranslationText languageId={languageId} />
        </Translation_>
      ))}
      inactiveTranslations={inactiveSubjectTranslations.map((translation) => (
        <Translation_
          languageId={translation.languageId}
          type="inactive"
          key={translation.id}
        >
          <$TranslationText>{translation.text}</$TranslationText>
        </Translation_>
      ))}
      removeFromParent={{
        func: () => removeSubjectFromParent(subjectId),
        entityType: "subject",
        parentType,
      }}
    />
  );
};

const ActiveTranslationText = ({ languageId }: { languageId: string }) => {
  const [{ translations }, { addTranslation, updateText }] =
    SubjectSlice.useContext();

  const translation = translations.find(
    (translation) => translation.languageId === languageId
  );

  const handleUpdateName = (text: string) => {
    if (translation) {
      updateText({ text, translationId: translation.id });
    } else {
      addTranslation({ languageId, text });
    }
  };

  return (
    <$TranslationText>
      <InlineTextEditor
        injectedValue={translation?.text || ""}
        onUpdate={handleUpdateName}
        placeholder=""
      >
        {!translation?.text.length ? () => <$MissingTranslationText /> : null}
      </InlineTextEditor>
    </$TranslationText>
  );
};

export default Found;

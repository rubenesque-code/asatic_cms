import SubjectSlice from "^context/subjects/SubjectContext";
import { useComponentContext } from "../../../Context";

import {
  getInactiveTranslationsOfChildEntity,
  sortStringsByLookup,
} from "^helpers/general";

import InlineTextEditor from "^components/editors/Inline";
import {
  $MissingTranslationText,
  $EntityTranslations,
} from "^components/rich-popover/_presentation/$RelatedEntities_";
import { $TranslationText } from "^components/rich-popover/_styles/relatedEntities";
import { Translation_ } from "^components/rich-popover/_containers/RelatedEntity";

const Found = () => {
  const { parentEntityData } = useComponentContext();

  const parentLanguagesIds = sortStringsByLookup(
    parentEntityData.activeLanguageId,
    parentEntityData.translationLanguagesIds
  );

  const [subject] = SubjectSlice.useContext();

  const inactiveSubjectTranslations = getInactiveTranslationsOfChildEntity(
    parentEntityData.translationLanguagesIds,
    subject.translations
  );

  return (
    <$EntityTranslations
      activeTranslations={parentLanguagesIds.map((languageId) => (
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
          <$TranslationText>{translation.title}</$TranslationText>
        </Translation_>
      ))}
    />
  );
};

export default Found;

const ActiveTranslationText = ({ languageId }: { languageId: string }) => {
  const [{ translations }, { addTranslation, updateTitle }] =
    SubjectSlice.useContext();

  const translation = translations.find(
    (translation) => translation.languageId === languageId
  );

  const handleUpdateTitle = (title: string) => {
    if (translation) {
      updateTitle({ title, translationId: translation.id });
    } else {
      addTranslation({ translation: { languageId, title: title } });
    }
  };

  return (
    <$TranslationText>
      <InlineTextEditor
        injectedValue={translation?.title || ""}
        onUpdate={handleUpdateTitle}
        placeholder=""
      >
        {!translation?.title?.length ? () => <$MissingTranslationText /> : null}
      </InlineTextEditor>
    </$TranslationText>
  );
};

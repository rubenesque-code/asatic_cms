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
} from "^components/rich-popover/_presentation/RelatedEntities";
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
          <$TranslationText>{translation.name}</$TranslationText>
        </Translation_>
      ))}
    />
  );
};

export default Found;

const ActiveTranslationText = ({ languageId }: { languageId: string }) => {
  const [{ translations }, { addTranslation, updateName }] =
    SubjectSlice.useContext();

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

import AuthorSlice from "^context/authors/AuthorContext";
import { useComponentContext } from "../../../Context";

import {
  getInactiveTranslationsOfChildEntity,
  sortStringsByLookup,
} from "^helpers/general";

import InlineTextEditor from "^components/editors/Inline";
import {
  $MissingTranslationText,
  $EntityTranslations,
  $Entity_,
} from "^components/rich-popover/_presentation";
import { $TranslationText } from "^components/rich-popover/_styles/relatedEntities";
import { Translation_ } from "^components/rich-popover/_containers/RelatedEntity";
import { useSelector } from "^redux/hooks";
import { selectEntityAuthorStatus } from "^redux/state/complex-selectors/entity-status/author";

const Found = () => {
  const { parentEntityData } = useComponentContext();

  const parentLanguagesIds = sortStringsByLookup(
    parentEntityData.activeLanguageId,
    parentEntityData.translationLanguagesIds
  );

  const [author] = AuthorSlice.useContext();

  const inactiveAuthorTranslations = getInactiveTranslationsOfChildEntity(
    parentEntityData.translationLanguagesIds,
    author.translations
  );

  const status = useSelector((state) =>
    selectEntityAuthorStatus(state, author, parentLanguagesIds)
  );

  return (
    <$Entity_
      status={status}
      text={
        <$EntityTranslations
          activeTranslations={parentLanguagesIds.map((languageId) => (
            <Translation_
              languageId={languageId}
              type="active"
              key={languageId}
            >
              <ActiveTranslationText languageId={languageId} />
            </Translation_>
          ))}
          inactiveTranslations={inactiveAuthorTranslations.map(
            (translation) => (
              <Translation_
                languageId={translation.languageId}
                type="inactive"
                key={translation.id}
              >
                <$TranslationText>{translation.name}</$TranslationText>
              </Translation_>
            )
          )}
        />
      }
    />
  );
};

export default Found;

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
        {!translation?.name?.length ? () => <$MissingTranslationText /> : null}
      </InlineTextEditor>
    </$TranslationText>
  );
};

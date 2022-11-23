import CollectionSlice from "^context/collections/CollectionContext";
import {
  getInactiveTranslationsOfChildEntity,
  sortStringsByLookup,
} from "^helpers/general";

import InlineTextEditor from "^components/editors/Inline";
import {
  $EntityTranslations,
  $MissingTranslationText,
} from "^components/rich-popover/_presentation/RelatedEntities";
import { $TranslationText } from "^components/rich-popover/_styles/relatedEntities";
import { Translation_ } from "^components/rich-popover/_containers/RelatedEntity";

import { useComponentContext } from "../../../Context";

const Found = () => {
  const { parentEntityData } = useComponentContext();

  const parentLanguagesIds = sortStringsByLookup(
    parentEntityData.activeLanguageId,
    parentEntityData.translationLanguagesIds
  );

  const [collection] = CollectionSlice.useContext();

  const inactiveCollectionTranslations = getInactiveTranslationsOfChildEntity(
    parentEntityData.translationLanguagesIds,
    collection.translations
  );

  return (
    <$EntityTranslations
      activeTranslations={parentLanguagesIds.map((languageId) => (
        <Translation_ languageId={languageId} type="active" key={languageId}>
          <ActiveTranslationText languageId={languageId} />
        </Translation_>
      ))}
      inactiveTranslations={inactiveCollectionTranslations.map(
        (translation) => (
          <Translation_
            languageId={translation.languageId}
            type="inactive"
            key={translation.id}
          >
            <$TranslationText>{translation.title}</$TranslationText>
          </Translation_>
        )
      )}
    />
  );
};

const ActiveTranslationText = ({ languageId }: { languageId: string }) => {
  const [{ translations }, { addTranslation, updateTitle }] =
    CollectionSlice.useContext();

  const translation = translations.find(
    (translation) => translation.languageId === languageId
  );

  const handleUpdateName = (title: string) => {
    if (translation) {
      updateTitle({ title, translationId: translation.id });
    } else {
      addTranslation({ translation: { languageId, title } });
    }
  };

  return (
    <$TranslationText>
      <InlineTextEditor
        injectedValue={translation?.title || ""}
        onUpdate={handleUpdateName}
        placeholder=""
      >
        {!translation?.title?.length ? () => <$MissingTranslationText /> : null}
      </InlineTextEditor>
    </$TranslationText>
  );
};

export default Found;

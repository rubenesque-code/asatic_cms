import CollectionSlice from "^context/collections/CollectionContext";
import {
  getInactiveTranslationsOfChildEntity,
  sortStringsByLookup,
} from "^helpers/general";

import InlineTextEditor from "^components/editors/Inline";
import {
  $EntityTranslations,
  $MissingTranslationText,
  $Entity_,
} from "^components/rich-popover/_presentation";
import { $TranslationText } from "^components/rich-popover/_styles/relatedEntities";
import { Translation_ } from "^components/rich-popover/_containers/RelatedEntity";

import { useComponentContext } from "../../../Context";
import { useSelector } from "^redux/hooks";
import { selectEntityCollectionStatus } from "^redux/state/complex-selectors/entity-status/collection";

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

  const status = useSelector((state) =>
    selectEntityCollectionStatus(state, collection, parentLanguagesIds)
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
      }
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

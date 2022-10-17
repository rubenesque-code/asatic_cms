import CollectionSlice from "^context/collections/CollectionContext";
import { arrayDivergence, sortStringsByLookup } from "^helpers/general";

import InlineTextEditor from "^components/editors/Inline";
import {
  $Entity,
  $MissingTranslationText,
} from "^components/rich-popover/_presentation/RelatedEntities";
import { $TranslationText } from "^components/rich-popover/_styles/relatedEntities";
import { Translation_ } from "^components/rich-popover/_containers/RelatedEntity";

import { useComponentContext } from "../../../Context";

const Found = () => {
  const [
    { activeLanguageId, parentLanguagesIds, parentType },
    { removeCollectionFromParent },
  ] = useComponentContext();
  const [
    {
      id: collectionId,
      languagesIds: collectionLanguagesIds,
      translations: collectionTranslations,
    },
  ] = CollectionSlice.useContext();

  const activeLanguagesIds = sortStringsByLookup(
    activeLanguageId,
    parentLanguagesIds
  );

  const inactiveCollectionTranslations = arrayDivergence(
    collectionLanguagesIds,
    activeLanguagesIds
  ).map(
    (languageId) =>
      collectionTranslations.find((a) => a.languageId === languageId)!
  );

  return (
    <$Entity
      activeTranslations={activeLanguagesIds.map((languageId) => (
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
      removeFromParent={{
        func: () => removeCollectionFromParent(collectionId),
        entityType: "collection",
        parentType,
      }}
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
      addTranslation({ languageId, title });
    }
  };

  return (
    <$TranslationText>
      <InlineTextEditor
        injectedValue={translation?.title || ""}
        onUpdate={handleUpdateName}
        placeholder=""
      >
        {!translation?.title.length ? () => <$MissingTranslationText /> : null}
      </InlineTextEditor>
    </$TranslationText>
  );
};

export default Found;

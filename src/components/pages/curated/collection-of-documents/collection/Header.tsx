import CollectionSlice from "^context/collections/CollectionContext";

import useCollectionPrimaryEntityPopoverProps from "^hooks/collections/usePrimaryEntityPopoverProps";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useCollectionPageTopControls from "^hooks/pages/useCollectionPageTopControls";
import useDeleteFromDbAndUpdateStore from "^hooks/collections/useDeleteFromDbAndUpdateStore";

import {
  Header_,
  $DefaultButtonSpacing,
  $MutationTextContainer,
  $VerticalBar,
  $SaveText_,
  UndoButton_,
  SaveButton_,
} from "^components/header";
import {
  HeaderEntityPageSettingsPopover_,
  HeaderPublishPopover_,
  HeaderSubectsPopover_,
  HeaderTagsPopover_,
  HeaderPrimaryEntityPopover_,
  HeaderEntityLanguagePopover_,
} from "^components/header/popovers";
import { useEntityLanguageContext } from "^context/EntityLanguages";

const entityType = "collection";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useCollectionPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <Header_
      leftElements={
        <>
          <$DefaultButtonSpacing>
            <PublishPopover />
            <LanguagesPopover />
          </$DefaultButtonSpacing>
          <$MutationTextContainer>
            <$SaveText_
              isChange={isChange}
              saveMutationData={saveMutationData}
            />
          </$MutationTextContainer>
        </>
      }
      rightElements={
        <$DefaultButtonSpacing>
          <PrimaryEntityPopover />
          <$VerticalBar />
          <SubjectsPopover />
          <TagsPopover />
          <$VerticalBar />
          <UndoButton_
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            undo={undo}
          />
          <SaveButton_
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            save={save}
          />
          <$VerticalBar />
          <SettingsPopover />
        </$DefaultButtonSpacing>
      }
    />
  );
};

export default Header;

const PublishPopover = () => {
  const [{ publishStatus }, { togglePublishStatus }] =
    CollectionSlice.useContext();

  return (
    <HeaderPublishPopover_
      publishStatus={publishStatus}
      togglePublishStatus={togglePublishStatus}
    />
  );
};

const LanguagesPopover = () => {
  const [{ languagesIds }, { addTranslation, removeTranslation }] =
    CollectionSlice.useContext();

  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const handleRemoveTranslation = (languageId: string) => {
    if (languagesIds.length < 2) {
      return;
    }
    if (languageId === activeLanguageId) {
      updateActiveLanguage(
        languagesIds.filter((languageId) => languageId !== activeLanguageId)[0]
      );
    }
    removeTranslation({ languageId });
  };

  return (
    <HeaderEntityLanguagePopover_
      parentEntity={{
        addTranslation: (languageId) =>
          addTranslation({ translation: { languageId } }),
        removeTranslation: handleRemoveTranslation,
        name: "collection",
        languagesIds,
      }}
    />
  );
};

const PrimaryEntityPopover = () => {
  const collectionProps = useCollectionPrimaryEntityPopoverProps();

  return <HeaderPrimaryEntityPopover_ {...collectionProps} />;
};

const SubjectsPopover = () => {
  const [
    { id: collectionId, languagesIds, subjectsIds },
    {
      addRelatedEntity: addRelatedEntityToCollection,
      removeRelatedEntity: removeRelatedEntityFromCollection,
    },
  ] = CollectionSlice.useContext();
  const { activeLanguageId } = useEntityLanguageContext();

  return (
    <HeaderSubectsPopover_
      parentEntity={{
        activeLanguageId,
        addSubject: (subjectId) =>
          addRelatedEntityToCollection({
            relatedEntity: { id: subjectId, name: "subject" },
          }),
        removeSubject: (subjectId) =>
          removeRelatedEntityFromCollection({
            relatedEntity: { id: subjectId, name: "subject" },
          }),
        id: collectionId,
        name: "collection",
        subjectIds: subjectsIds,
        translationLanguagesIds: languagesIds,
      }}
    />
  );
};

const TagsPopover = () => {
  const [
    { id, tagsIds },
    {
      addRelatedEntity: addRelatedEntityToCollection,
      removeRelatedEntity: removeRelatedEntityFromCollection,
    },
  ] = CollectionSlice.useContext();

  return (
    <HeaderTagsPopover_
      parentEntity={{
        addTag: (tagId) =>
          addRelatedEntityToCollection({
            relatedEntity: { id: tagId, name: "tag" },
          }),
        removeTag: (tagId) =>
          removeRelatedEntityFromCollection({
            relatedEntity: { id: tagId, name: "tag" },
          }),
        id,
        name: "collection",
        tagsIds,
      }}
    />
  );
};

const SettingsPopover = () => {
  const deleteCollection = useDeleteFromDbAndUpdateStore();

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={deleteCollection}
      entityType={entityType}
    />
  );
};

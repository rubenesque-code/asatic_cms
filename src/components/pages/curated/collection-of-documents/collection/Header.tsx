import { toast } from "react-toastify";

import CollectionSlice from "^context/collections/CollectionContext";

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
  LanguageLabel_,
} from "^components/header";
import {
  HeaderEntityPageSettingsPopover_,
  HeaderPublishPopover_,
  HeaderTagsPopover_,
  HeaderDocumentEntityPopover_,
} from "^components/header/popovers";

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
            <LanguageLabel />
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
          <DocumentEntityPopover />
          <$VerticalBar />
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

const LanguageLabel = () => {
  const [{ languageId }] = CollectionSlice.useContext();

  return <LanguageLabel_ languageId={languageId} />;
};

const DocumentEntityPopover = () => {
  const [
    { id, languageId, articlesIds, blogsIds, recordedEventsIds },
    { addRelatedEntity },
  ] = CollectionSlice.useContext();

  return (
    <HeaderDocumentEntityPopover_
      parentEntity={{
        actions: {
          addEntity: (entity) => {
            addRelatedEntity({ relatedEntity: entity });
            toast.success("Added");
          },
        },
        data: {
          existingEntitiesIds: {
            articles: articlesIds,
            blogs: blogsIds,
            recordedEvents: recordedEventsIds,
          },
          name: "collection",
          limitToLanguageId: languageId,
          id,
        },
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

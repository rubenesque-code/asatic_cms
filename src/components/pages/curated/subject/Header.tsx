import SubjectSlice from "^context/subjects/SubjectContext";

import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useCollectionPrimaryEntityPopoverProps from "^hooks/collections/usePrimaryEntityPopoverProps";
import useSubjectPageTopControls from "^hooks/pages/useSubjectPageTopControls";
import useDeleteSubject from "^hooks/subjects/useDeleteSubject";

import {
  Header_,
  $DefaultButtonSpacing,
  $MutationTextContainer,
  $VerticalBar,
  $SaveText_,
  UndoButton_,
  SaveButton_,
} from "^components/header";
import DocLanguages from "^components/DocLanguages";
import {
  HeaderEntityPageSettingsPopover_,
  HeaderPublishPopover_,
  HeaderTagsPopover_,
  HeaderPrimaryEntityPopover_,
} from "^components/header/popovers";

const entityType = "subject";

const $DisplayEntityHeader_ = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useSubjectPageTopControls();

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

export default $DisplayEntityHeader_;

const PublishPopover = () => {
  const [{ publishStatus }, { togglePublishStatus }] =
    SubjectSlice.useContext();

  return (
    <HeaderPublishPopover_
      publishStatus={publishStatus}
      togglePublishStatus={togglePublishStatus}
    />
  );
};

const LanguagesPopover = () => {
  const [, { addTranslation, removeTranslation }] = SubjectSlice.useContext();

  return (
    <DocLanguages.Popover
      docType={entityType}
      addLanguageToDoc={(languageId) => addTranslation({ languageId })}
      removeLanguageFromDoc={(languageId) => removeTranslation({ languageId })}
    />
  );
};

const PrimaryEntityPopover = () => {
  const collectionProps = useCollectionPrimaryEntityPopoverProps();

  return <HeaderPrimaryEntityPopover_ {...collectionProps} />;
};

const TagsPopover = () => {
  const [{ id, tagsIds }, { addRelatedEntity, removeRelatedEntity }] =
    SubjectSlice.useContext();

  return (
    <HeaderTagsPopover_
      relatedEntityData={{
        id,
        name: "subject",
        tagsIds,
      }}
      relatedEntityActions={{
        addTagToRelatedEntity: (tagId) =>
          addRelatedEntity({ relatedEntity: { id: tagId, name: "tag" } }),
        removeTagFromRelatedEntity: (tagId) =>
          removeRelatedEntity({ relatedEntity: { id: tagId, name: "tag" } }),
      }}
    />
  );
};

const SettingsPopover = () => {
  const handleDeleteSubject = useDeleteSubject();

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={handleDeleteSubject}
      entityType={entityType}
    />
  );
};

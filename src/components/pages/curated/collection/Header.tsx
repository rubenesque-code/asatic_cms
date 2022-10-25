import CollectionSlice from "^context/collections/CollectionContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import useCollectionPrimaryEntityPopoverProps from "^hooks/collections/usePrimaryEntityPopoverProps";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useCollectionPageTopControls from "^hooks/pages/useCollectionPageTopControls";

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
  HeaderSubectsPopover_,
  HeaderTagsPopover_,
  HeaderPrimaryEntityPopover_,
} from "^components/header/popovers";

const entityType = "collection";

const $DisplayEntityHeader_ = () => {
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

export default $DisplayEntityHeader_;

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
  const [, { addTranslation, removeTranslation }] =
    CollectionSlice.useContext();

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

const SubjectsPopover = () => {
  const [{ languagesIds, subjectsIds }, { addSubject, removeSubject }] =
    CollectionSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderSubectsPopover_
      parentData={{
        activeLanguageId,
        parentSubjectsIds: subjectsIds,
        parentLanguagesIds: languagesIds,
        parentType: entityType,
      }}
      parentActions={{
        addSubjectToParent: (subjectId) => addSubject({ subjectId }),
        removeSubjectFromParent: (subjectId) => removeSubject({ subjectId }),
      }}
    />
  );
};

const TagsPopover = () => {
  const [{ tagsIds }, { addTag, removeTag }] = CollectionSlice.useContext();

  return (
    <HeaderTagsPopover_
      parentData={{
        parentTagsIds: tagsIds,
        parentType: entityType,
      }}
      parentActions={{
        addTagToParent: (tagId) => addTag({ tagId }),
        removeTagFromParent: (tagId) => removeTag({ tagId }),
      }}
    />
  );
};

const SettingsPopover = () => {
  const [{ id }] = CollectionSlice.useContext();
  const [deleteFromDb] = useDeleteMutationContext();

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={() => deleteFromDb({ id, useToasts: true })}
      entityType={entityType}
    />
  );
};
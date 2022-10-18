// addprimarycontent| subjects, tags| undo save | settings

import CollectionSlice from "^context/collections/CollectionContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import useCollectionPageSaveUndo from "^hooks/pages/useCollectionPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import $Header_ from "^components/display-entity/entity-page/_presentation/$Header_";
import $SaveText_ from "^components/header/_presentation/$SaveText_";
import UndoButton from "^components/header/UndoButton";
import SaveButton from "^components/header/SaveButton";
import DocLanguages from "^components/DocLanguages";
import PublishPopover_ from "^components/rich-popover/publish";
import SettingsPopover_ from "^components/rich-popover/entity-page-settings";
import SubjectsPopover_ from "^components/rich-popover/subjects";
import TagsPopover_ from "^components/rich-popover/tags";
import {
  SubjectsHeaderButton,
  TagsHeaderButton,
  HeaderEntityPageSettingsButton,
  HeaderPublishButton,
} from "^components/header/popover-buttons";

const entityType = "recorded-event";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useCollectionPageSaveUndo();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <$Header_
      entityLanguagesPopover={<LanguagesPopover />}
      publishPopover={<PublishPopover />}
      saveButton={
        <SaveButton
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
          save={save}
        />
      }
      saveText={
        <$SaveText_ isChange={isChange} saveMutationData={saveMutationData} />
      }
      settingsPopover={<SettingsPopover />}
      subjectsPopover={<SubjectsPopover />}
      undoButton={
        <UndoButton
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
          undo={undo}
        />
      }
      tagsPopover={<TagsPopover />}
    />
  );
};

export default Header;

const PublishPopover = () => {
  const [{ publishStatus }, { togglePublishStatus }] =
    CollectionSlice.useContext();

  return (
    <PublishPopover_
      publishStatus={publishStatus}
      togglePublishStatus={togglePublishStatus}
    >
      <HeaderPublishButton />
    </PublishPopover_>
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

const SubjectsPopover = () => {
  const [{ languagesIds, subjectsIds }, { addSubject, removeSubject }] =
    CollectionSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <SubjectsPopover_
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
    >
      <SubjectsHeaderButton />
    </SubjectsPopover_>
  );
};

const TagsPopover = () => {
  const [{ tagsIds }, { addTag, removeTag }] = CollectionSlice.useContext();

  return (
    <TagsPopover_
      parentData={{
        parentTagsIds: tagsIds,
        parentType: entityType,
      }}
      parentActions={{
        addTagToParent: (tagId) => addTag({ tagId }),
        removeTagFromParent: (tagId) => removeTag({ tagId }),
      }}
    >
      <TagsHeaderButton />
    </TagsPopover_>
  );
};

const SettingsPopover = () => {
  const [{ id }] = CollectionSlice.useContext();
  const [deleteFromDb] = useDeleteMutationContext();

  return (
    <SettingsPopover_
      deleteEntity={() => deleteFromDb({ id, useToasts: true })}
      entityType="video document"
    >
      <HeaderEntityPageSettingsButton />
    </SettingsPopover_>
  );
};

const AddPrimaryContentPopover = () => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const dispatch = useDispatch();

  return (
    <PrimaryContentPopover
      addEntityTo="collection"
      addEntity={({ entityId, entityType }) => {
        if (entityType === "article") {
          dispatch(addCollectionToArticle({ collectionId, id: entityId }));
        } else if (entityType === "blog") {
          dispatch(addCollectionToBlog({ collectionId, id: entityId }));
        } else if (entityType === "recorded-event") {
          dispatch(
            addCollectionToRecordedEvent({ id: entityId, collectionId })
          );
        }
      }}
    >
      <HeaderGeneric.IconButton tooltip="add content">
        <Plus />
      </HeaderGeneric.IconButton>
    </PrimaryContentPopover>
  );
};

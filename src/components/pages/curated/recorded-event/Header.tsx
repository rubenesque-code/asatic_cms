import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import useRecordedEventPageSaveUndo from "^hooks/pages/useRecordedEventPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import $Header_ from "../_presentation/$Header_";
import { $SaveText_, UndoButton_, SaveButton_ } from "^components/header";
import DocLanguages from "^components/DocLanguages";
import {
  HeaderAuthorsPopover_,
  HeaderCollectionsPopover_,
  HeaderEntityPageSettingsPopover_,
  HeaderPublishPopover_,
  HeaderSubectsPopover_,
  HeaderTagsPopover_,
} from "^components/header/popovers";
import { useDeleteRecordedEventMutation } from "^redux/services/recordedEvents";
import useDeleteRecordedEvent from "^hooks/recorded-events/useDeleteRecordedEvent";

const entityType = "video document";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useRecordedEventPageSaveUndo();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <$Header_
      entityLanguagesPopover={<LanguagesPopover />}
      publishPopover={<PublishPopover />}
      saveButton={
        <SaveButton_
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
        <UndoButton_
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
          undo={undo}
        />
      }
      authorsPopover={<AuthorsPopover />}
      collectionsPopover={<CollectionsPopover />}
      tagsPopover={<TagsPopover />}
    />
  );
};

export default Header;

const PublishPopover = () => {
  const [{ publishStatus }, { togglePublishStatus }] =
    RecordedEventSlice.useContext();

  return (
    <HeaderPublishPopover_
      publishStatus={publishStatus}
      togglePublishStatus={togglePublishStatus}
    />
  );
};

const LanguagesPopover = () => {
  const [, { addTranslation, removeTranslation }] =
    RecordedEventSlice.useContext();

  return (
    <DocLanguages.Popover
      docType={entityType}
      addLanguageToDoc={(languageId) => addTranslation({ languageId })}
      removeLanguageFromDoc={(languageId) => removeTranslation({ languageId })}
    />
  );
};

const SubjectsPopover = () => {
  const [{ id, languagesIds, subjectsIds }, { addSubject, removeSubject }] =
    RecordedEventSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderSubectsPopover_
      parentData={{
        id,
        activeLanguageId,
        subjectsIds,
        languagesIds,
        type: "recorded-event",
      }}
      parentActions={{
        addSubjectToParent: (subjectId) => addSubject({ subjectId }),
        removeSubjectFromParent: (subjectId) => removeSubject({ subjectId }),
      }}
    />
  );
};

const CollectionsPopover = () => {
  const [
    { id, languagesIds, collectionsIds },
    { addCollection, removeCollection },
  ] = RecordedEventSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderCollectionsPopover_
      parentData={{
        id,
        activeLanguageId,
        parentCollectionsIds: collectionsIds,
        parentLanguagesIds: languagesIds,
        parentType: "recorded-event",
      }}
      parentActions={{
        addCollectionToParent: (collectionId) =>
          addCollection({ collectionId }),
        removeCollectionFromParent: (collectionId) =>
          removeCollection({ collectionId }),
      }}
    />
  );
};

const AuthorsPopover = () => {
  const [{ id, authorsIds, languagesIds }, { addAuthor, removeAuthor }] =
    RecordedEventSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderAuthorsPopover_
      parentData={{
        id,
        activeLanguageId,
        parentAuthorsIds: authorsIds,
        parentLanguagesIds: languagesIds,
        parentType: "recorded-event",
      }}
      parentActions={{
        addAuthorToParent: (authorId) => addAuthor({ authorId }),
        removeAuthorFromParent: (authorId) => removeAuthor({ authorId }),
      }}
    />
  );
};

const TagsPopover = () => {
  const [{ id, tagsIds }, { addTag, removeTag }] =
    RecordedEventSlice.useContext();

  return (
    <HeaderTagsPopover_
      relatedEntityData={{
        id,
        parentTagsIds: tagsIds,
        parentType: "recorded-event",
      }}
      relatedEntityActions={{
        addTag: (tagId) => addTag({ tagId }),
        removeTag: (tagId) => removeTag({ tagId }),
      }}
    />
  );
};

const SettingsPopover = () => {
  const [{ id, authorsIds, collectionsIds, subjectsIds, tagsIds }] =
    RecordedEventSlice.useContext();
  const [deleteFromDb] = useDeleteRecordedEventMutation();

  const deleteRecordedEvent = useDeleteRecordedEvent({
    entityId: id,
    authorsIds,
    collectionsIds,
    subjectsIds,
    tagsIds,
    deleteFromDb,
  });

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={deleteRecordedEvent}
      entityType={entityType}
    />
  );
};

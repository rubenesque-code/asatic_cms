import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import useRecordedEventsSaveUndo from "^hooks/pages/useRecordedEventPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import DisplayEntityHeader from "^components/display-entity/entity-page/Header";
import $SaveText_ from "^components/header/_presentation/$SaveText_";
import UndoButton from "^components/header/UndoButton";
import SaveButton from "^components/header/SaveButton";
import DocLanguages from "^components/DocLanguages";
import PublishPopover_ from "^components/rich-popover/publish";
import SettingsPopover_ from "^components/rich-popover/entity-page-settings";
import AuthorsPopover_ from "^components/rich-popover/authors";
import CollectionsPopover_ from "^components/rich-popover/collections";
import SubjectsPopover_ from "^components/rich-popover/subjects";
import TagsPopover_ from "^components/rich-popover/tags";
import {
  AuthorsHeaderButton,
  CollectionsHeaderButton,
  SubjectsHeaderButton,
  TagsHeaderButton,
  HeaderEntityPageSettingsButton,
  HeaderPublishButton,
} from "^components/header/popover-buttons";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

const entityType = "recorded-event";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useRecordedEventsSaveUndo();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <DisplayEntityHeader
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
  const [{ languagesIds, subjectsIds }, { addSubject, removeSubject }] =
    RecordedEventSlice.useContext();
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

const CollectionsPopover = () => {
  const [
    { languagesIds, collectionsIds },
    { addCollection, removeCollection },
  ] = RecordedEventSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <CollectionsPopover_
      parentData={{
        activeLanguageId,
        parentCollectionsIds: collectionsIds,
        parentLanguagesIds: languagesIds,
        parentType: entityType,
      }}
      parentActions={{
        addCollectionToParent: (collectionId) =>
          addCollection({ collectionId }),
        removeCollectionFromParent: (collectionId) =>
          removeCollection({ collectionId }),
      }}
    >
      <CollectionsHeaderButton />
    </CollectionsPopover_>
  );
};

const AuthorsPopover = () => {
  const [{ authorsIds, languagesIds }, { addAuthor, removeAuthor }] =
    RecordedEventSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <AuthorsPopover_
      parentData={{
        activeLanguageId,
        parentAuthorsIds: authorsIds,
        parentLanguagesIds: languagesIds,
        parentType: entityType,
      }}
      parentActions={{
        addAuthorToParent: (authorId) => addAuthor({ authorId }),
        removeAuthorFromParent: (authorId) => removeAuthor({ authorId }),
      }}
    >
      <AuthorsHeaderButton />
    </AuthorsPopover_>
  );
};

const TagsPopover = () => {
  const [{ tagsIds }, { addTag, removeTag }] = RecordedEventSlice.useContext();

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
  const [deleteFromDb] = useDeleteMutationContext();

  return (
    <SettingsPopover_ deleteEntity={deleteFromDb} entityType="video document">
      <HeaderEntityPageSettingsButton />
    </SettingsPopover_>
  );
};

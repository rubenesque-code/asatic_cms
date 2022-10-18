import BlogSlice from "^context/blogs/BlogContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import useBlogSaveUndo from "^hooks/pages/useBlogPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import $Header_ from "^components/display-entity/entity-page/_presentation/$Header_";
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

const entityType = "blog";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useBlogSaveUndo();

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
      authorsPopover={<AuthorsPopover />}
      collectionsPopover={<CollectionsPopover />}
      tagsPopover={<TagsPopover />}
    />
  );
};

export default Header;

const PublishPopover = () => {
  const [{ publishStatus }, { togglePublishStatus }] = BlogSlice.useContext();

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
  const [, { addTranslation, removeTranslation }] = BlogSlice.useContext();

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
    BlogSlice.useContext();
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
  ] = BlogSlice.useContext();
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
    BlogSlice.useContext();
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
  const [{ tagsIds }, { addTag, removeTag }] = BlogSlice.useContext();

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
  const [{ id }] = BlogSlice.useContext();
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

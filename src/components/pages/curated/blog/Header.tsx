import BlogSlice from "^context/blogs/BlogContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import useBlogPageSaveUndo from "^hooks/pages/useBlogPageTopControls";
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
import useOnDeleteDisplayEntity from "^hooks/useOnDeleteDisplayEntity";

const entityType = "article";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useBlogPageSaveUndo();

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
  const [{ publishStatus }, { togglePublishStatus }] = BlogSlice.useContext();

  return (
    <HeaderPublishPopover_
      publishStatus={publishStatus}
      togglePublishStatus={togglePublishStatus}
    />
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
  const [{ id, languagesIds, subjectsIds }, { addSubject, removeSubject }] =
    BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderSubectsPopover_
      parentData={{
        id,
        activeLanguageId,
        subjectsIds,
        languagesIds,
        type: entityType,
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
  ] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderCollectionsPopover_
      parentData={{
        id,
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
    />
  );
};

const AuthorsPopover = () => {
  const [{ id, authorsIds, languagesIds }, { addAuthor, removeAuthor }] =
    BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderAuthorsPopover_
      parentData={{
        id,
        activeLanguageId,
        parentAuthorsIds: authorsIds,
        parentLanguagesIds: languagesIds,
        parentType: entityType,
      }}
      parentActions={{
        addAuthorToParent: (authorId) => addAuthor({ authorId }),
        removeAuthorFromParent: (authorId) => removeAuthor({ authorId }),
      }}
    />
  );
};

const TagsPopover = () => {
  const [{ id, tagsIds }, { addTag, removeTag }] = BlogSlice.useContext();

  return (
    <HeaderTagsPopover_
      parentData={{
        id,
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
  const [{ id, authorsIds, collectionsIds, subjectsIds, tagsIds }] =
    BlogSlice.useContext();
  const [deleteFromDb] = useDeleteMutationContext();

  const onDelete = useOnDeleteDisplayEntity({
    entityId: id,
    authorsIds,
    collectionsIds,
    subjectsIds,
    tagsIds,
  });

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={() => deleteFromDb({ id, useToasts: true, onDelete })}
      entityType={entityType}
    />
  );
};

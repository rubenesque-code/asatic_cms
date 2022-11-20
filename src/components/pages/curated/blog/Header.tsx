import BlogSlice from "^context/blogs/BlogContext";

import useBlogPageSaveUndo from "^hooks/pages/useBlogPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useDeleteBlog from "^hooks/blogs/useDeleteBlog";

import { EntityName } from "^types/entity";

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

const entityName: EntityName = "blog";

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
      docType={entityName}
      addLanguageToDoc={(languageId) => addTranslation({ languageId })}
      removeLanguageFromDoc={(languageId) => removeTranslation({ languageId })}
    />
  );
};

const SubjectsPopover = () => {
  const [
    { id, languagesIds, subjectsIds },
    {
      addRelatedEntity: addRelatedEntityToBlog,
      removeRelatedEntity: removeRelatedEntityFromBlog,
    },
  ] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderSubectsPopover_
      parentEntity={{
        activeLanguageId,
        addSubject: (subjectId) =>
          addRelatedEntityToBlog({
            relatedEntity: { id: subjectId, name: "subject" },
          }),
        id,
        name: entityName,
        removeSubject: (subjectId) =>
          removeRelatedEntityFromBlog({
            relatedEntity: { id: subjectId, name: "subject" },
          }),
        subjectIds: subjectsIds,
        translationLanguagesIds: languagesIds,
      }}
    />
  );
};

const CollectionsPopover = () => {
  const [
    { id, languagesIds, collectionsIds },
    {
      addRelatedEntity: addRelatedEntityToBlog,
      removeRelatedEntity: removeRelatedEntityFromBlog,
    },
  ] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderCollectionsPopover_
      parentEntity={{
        activeLanguageId,
        addCollection: (collectionId) =>
          addRelatedEntityToBlog({
            relatedEntity: { id: collectionId, name: "collection" },
          }),
        removeCollection: (collectionId) =>
          removeRelatedEntityFromBlog({
            relatedEntity: { id: collectionId, name: "collection" },
          }),
        collectionsIds,
        id,
        name: entityName,
        translationLanguagesIds: languagesIds,
      }}
    />
  );
};

const AuthorsPopover = () => {
  const [
    { id: blogId, authorsIds, languagesIds },
    {
      addRelatedEntity: addRelatedEntityToBlog,
      removeRelatedEntity: removeRelatedEntityFromBlog,
    },
  ] = BlogSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderAuthorsPopover_
      parentEntity={{
        activeLanguageId,
        addAuthor: (authorId) =>
          addRelatedEntityToBlog({
            relatedEntity: { id: authorId, name: "author" },
          }),
        authorsIds,
        id: blogId,
        name: entityName,
        removeAuthor: (authorId) =>
          removeRelatedEntityFromBlog({
            relatedEntity: { id: authorId, name: "author" },
          }),
        translationLanguagesIds: languagesIds,
      }}
    />
  );
};

const TagsPopover = () => {
  const [
    { id, tagsIds },
    {
      addRelatedEntity: addRelatedEntityToBlog,
      removeRelatedEntity: removeRelatedEntityFromBlog,
    },
  ] = BlogSlice.useContext();

  return (
    <HeaderTagsPopover_
      parentEntity={{
        addTag: (tagId) =>
          addRelatedEntityToBlog({
            relatedEntity: { id: tagId, name: "tag" },
          }),
        removeTag: (tagId) =>
          removeRelatedEntityFromBlog({
            relatedEntity: { id: tagId, name: "tag" },
          }),
        id,
        name: entityName,
        tagsIds,
      }}
    />
  );
};

const SettingsPopover = () => {
  const deleteBlog = useDeleteBlog();

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={deleteBlog}
      entityType={entityName}
    />
  );
};

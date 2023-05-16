import BlogSlice from "^context/blogs/BlogContext";
import { useEntityLanguageContext } from "^context/EntityLanguages";

import useBlogPageSaveUndo from "^hooks/pages/useBlogPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useDeleteBlogFromDbAndUpdateStore from "^hooks/blogs/useDeleteFromDbAndUpdateStore";

import { EntityName } from "^types/entity";

import $Header_ from "^document-pages/_presentation/$Header_";
import { $SaveText_, UndoButton_, SaveButton_ } from "^components/header";
import {
  HeaderAuthorsPopover_,
  // HeaderCollectionsPopover_,
  HeaderEntityPageSettingsPopover_,
  HeaderPublishPopover_,
  // HeaderSubectsPopover_,
  HeaderTagsPopover_,
  HeaderEntityLanguagePopover_,
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
      // subjectsPopover={<SubjectsPopover />}
      undoButton={
        <UndoButton_
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
          undo={undo}
        />
      }
      authorsPopover={<AuthorsPopover />}
      // collectionsPopover={<CollectionsPopover />}
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
  const [{ languagesIds }, { addTranslation, removeTranslation }] =
    BlogSlice.useContext();
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
        addTranslation: (languageId) => addTranslation({ languageId }),
        removeTranslation: handleRemoveTranslation,
        name: "blog",
        languagesIds,
      }}
    />
  );
};

/* const SubjectsPopover = () => {
  const [
    { id, languagesIds, subjectsIds },
    {
      addRelatedEntity: addRelatedEntityToBlog,
      removeRelatedEntity: removeRelatedEntityFromBlog,
    },
  ] = BlogSlice.useContext();
  const { activeLanguageId } = useEntityLanguageContext();

  return (
    <HeaderSubectsPopover_
      parentEntity={{
        activeLanguageId,
        addSubject: (subjectId) =>
          addRelatedEntityToBlog({
            relatedEntity: { id: subjectId, name: "subject" },
          }),
        id,
        name: "blog",
        removeSubject: (subjectId) =>
          removeRelatedEntityFromBlog({
            relatedEntity: { id: subjectId, name: "subject" },
          }),
        subjectIds: subjectsIds,
        translationLanguagesIds: languagesIds,
      }}
    />
  );
}; */

/* const CollectionsPopover = () => {
  const [
    { id, languagesIds, collectionsIds },
    {
      addRelatedEntity: addRelatedEntityToBlog,
      removeRelatedEntity: removeRelatedEntityFromBlog,
    },
  ] = BlogSlice.useContext();
  const { activeLanguageId } = useEntityLanguageContext();

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
        name: "blog",
        translationLanguagesIds: languagesIds,
      }}
    />
  );
}; */

const AuthorsPopover = () => {
  const [
    { id, authorsIds, languagesIds },
    {
      addRelatedEntity: addRelatedEntityToBlog,
      removeRelatedEntity: removeRelatedEntityFromBlog,
    },
  ] = BlogSlice.useContext();
  const { activeLanguageId } = useEntityLanguageContext();

  return (
    <HeaderAuthorsPopover_
      parentEntity={{
        activeLanguageId,
        addAuthor: (authorId) =>
          addRelatedEntityToBlog({
            relatedEntity: { id: authorId, name: "author" },
          }),
        authorsIds,
        id,
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
        name: "blog",
        tagsIds,
      }}
    />
  );
};

const SettingsPopover = () => {
  const deleteBlogFromDbAndUpdateStore = useDeleteBlogFromDbAndUpdateStore();

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={deleteBlogFromDbAndUpdateStore}
      entityType={entityName}
    />
  );
};

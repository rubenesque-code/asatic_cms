import ArticleSlice from "^context/articles/ArticleContext";

import useArticlePageSaveUndo from "^hooks/pages/useArticlePageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useDeleteArticle from "^hooks/articles/useDeleteArticle";

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

const entityName: EntityName = "article";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useArticlePageSaveUndo();

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
    ArticleSlice.useContext();

  return (
    <HeaderPublishPopover_
      publishStatus={publishStatus}
      togglePublishStatus={togglePublishStatus}
    />
  );
};

const LanguagesPopover = () => {
  const [, { addTranslation, removeTranslation }] = ArticleSlice.useContext();

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
      addRelatedEntity: addRelatedEntityToArticle,
      removeRelatedEntity: removeRelatedEntityFromArticle,
    },
  ] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderSubectsPopover_
      parentEntity={{
        activeLanguageId,
        addSubject: (subjectId) =>
          addRelatedEntityToArticle({
            relatedEntity: { id: subjectId, name: "subject" },
          }),
        id,
        name: "article",
        removeSubject: (subjectId) =>
          removeRelatedEntityFromArticle({
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
      addRelatedEntity: addRelatedEntityToArticle,
      removeRelatedEntity: removeRelatedEntityFromArticle,
    },
  ] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderCollectionsPopover_
      parentActions={{
        addCollectionToParent: (collectionId) =>
          addRelatedEntityToArticle({
            relatedEntity: { id: collectionId, name: "collection" },
          }),
        removeCollectionFromParent: (collectionId) =>
          removeRelatedEntityFromArticle({
            relatedEntity: { id: collectionId, name: "collection" },
          }),
      }}
      parentData={{
        activeLanguageId,
        id,
        parentCollectionsIds: collectionsIds,
        parentLanguagesIds: languagesIds,
        parentType: "article",
      }}
    />
  );
};

const AuthorsPopover = () => {
  const [
    { id, authorsIds, languagesIds },
    {
      addRelatedEntity: addRelatedEntityToArticle,
      removeRelatedEntity: removeRelatedEntityFromArticle,
    },
  ] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <HeaderAuthorsPopover_
      parentEntity={{
        activeLanguageId,
        addAuthor: (authorId) =>
          addRelatedEntityToArticle({
            relatedEntity: { id: authorId, name: "author" },
          }),
        authorsIds,
        id,
        name: "article",
        removeAuthor: (authorId) =>
          removeRelatedEntityFromArticle({
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
      addRelatedEntity: addRelatedEntityToArticle,
      removeRelatedEntity: removeRelatedEntityFromArticle,
    },
  ] = ArticleSlice.useContext();

  return (
    <HeaderTagsPopover_
      relatedEntityActions={{
        addTag: (tagId) =>
          addRelatedEntityToArticle({
            relatedEntity: { id: tagId, name: "tag" },
          }),
        removeTag: (tagId) =>
          removeRelatedEntityFromArticle({
            relatedEntity: { id: tagId, name: "tag" },
          }),
      }}
      relatedEntityData={{ id, name: "article", tagsIds }}
    />
  );
};

const SettingsPopover = () => {
  const deleteArticle = useDeleteArticle();

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={deleteArticle}
      entityType={entityName}
    />
  );
};

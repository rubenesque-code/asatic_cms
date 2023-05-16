import ArticleSlice from "^context/articles/ArticleContext";
import { useEntityLanguageContext } from "^context/EntityLanguages";

import useArticlePageSaveUndo from "^hooks/pages/useArticlePageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useDeleteArticleFromDbAndUpdateStore from "^hooks/articles/useDeleteFromDbAndUpdateStore";

import { EntityName } from "^types/entity";

import $Header_ from "../_presentation/$Header_";
import { $SaveText_, UndoButton_, SaveButton_ } from "^components/header";
import {
  HeaderAuthorsPopover_,
  HeaderEntityPageSettingsPopover_,
  HeaderPublishPopover_,
  HeaderTagsPopover_,
  HeaderEntityLanguagePopover_,
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
      undoButton={
        <UndoButton_
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
          undo={undo}
        />
      }
      authorsPopover={<AuthorsPopover />}
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
  const [{ languagesIds }, { addTranslation, removeTranslation }] =
    ArticleSlice.useContext();
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
        name: "article",
        languagesIds,
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
  const { activeLanguageId } = useEntityLanguageContext();

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
        name: entityName,
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
      parentEntity={{
        addTag: (tagId) =>
          addRelatedEntityToArticle({
            relatedEntity: { id: tagId, name: "tag" },
          }),
        removeTag: (tagId) =>
          removeRelatedEntityFromArticle({
            relatedEntity: { id: tagId, name: "tag" },
          }),
        id,
        name: "article",
        tagsIds,
      }}
    />
  );
};

const SettingsPopover = () => {
  const deleteArticleFromDbAndUpdateStore =
    useDeleteArticleFromDbAndUpdateStore();

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={deleteArticleFromDbAndUpdateStore}
      entityType={entityName}
    />
  );
};

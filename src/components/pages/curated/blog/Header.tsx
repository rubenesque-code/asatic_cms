import BlogSlice from "^context/blogs/BlogContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import useBlogPageSaveUndo from "^hooks/pages/useBlogPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import $Header_ from "../_presentation/$Header_";
import { $SaveText_, UndoButton_, SaveButton_ } from "^components/header";
import DocLanguages from "^components/DocLanguages";
import {
  AuthorsPopover_,
  CollectionsPopover_,
  PublishPopover_,
  EntityPageSettingsPopover_ as SettingsPopover_,
  SubjectsPopover_,
  TagsPopover_,
} from "^components/rich-popover";
import {
  AuthorsHeaderButton as AuthorsButton,
  CollectionsHeaderButton as CollectionsButton,
  SubjectsHeaderButton as SubjectsButton,
  TagsHeaderButton as TagsButton,
  HeaderPublishButton as PublishButton,
  HeaderEntityPageSettingsButton as SettingsButton,
} from "^components/header/popover-buttons";

const entityType = "blog";

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
    <PublishPopover_
      publishStatus={publishStatus}
      togglePublishStatus={togglePublishStatus}
    >
      <PublishButton />
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
      <SubjectsButton />
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
      <CollectionsButton />
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
      <AuthorsButton />
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
      <TagsButton />
    </TagsPopover_>
  );
};

const SettingsPopover = () => {
  const [{ id }] = BlogSlice.useContext();
  const [deleteFromDb] = useDeleteMutationContext();

  return (
    <SettingsPopover_
      deleteEntity={() => deleteFromDb({ id, useToasts: true })}
      entityType={entityType}
    >
      <SettingsButton />
    </SettingsPopover_>
  );
};

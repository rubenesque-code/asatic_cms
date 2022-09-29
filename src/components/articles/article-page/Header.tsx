import tw from "twin.macro";

import ArticleSlice from "^context/articles/ArticleContext";

import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useArticlePageTopControls from "^hooks/pages/useArticlePageTopControls";

import HeaderGeneric from "^components/header/Header";
import PublishPopoverUnpopulated from "^components/header/PublishPopover";
import SaveTextUI from "^components/header/mutation-text/SaveTextUI";
import HeaderUI from "^components/header/HeaderUI";
import SettingsPopoverUnpopulated from "^components/header/SettingsPopover";
import UndoButton from "^components/header/UndoButton";
import SaveButton from "^components/header/SaveButton";
import AuthorsButton from "^components/header/secondary-content-buttons/AuthorsButton";
import TagsButton from "^components/header/secondary-content-buttons/TagsButton";
import SubjectsButton from "^components/header/secondary-content-buttons/SubjectsButton";
import CollectionsButton from "^components/header/secondary-content-buttons/CollectionsButton";
import DocLanguages from "^components/DocLanguages";
import DocSubjectsPopover from "^components/secondary-content-popovers/subjects";
import DocAuthorsPopover from "^components/secondary-content-popovers/authors";
import DocTagsPopover from "^components/secondary-content-popovers/tags";
import DocCollectionsPopover from "^components/secondary-content-popovers/collections";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useArticlePageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <HeaderGeneric
      leftElements={
        <>
          <HeaderUI.DefaultButtonSpacing>
            <PublishPopover />
            <DocLanguagesPopover />
          </HeaderUI.DefaultButtonSpacing>
          <div css={[tw`ml-md`]}>
            <SaveTextUI
              isChange={isChange}
              saveMutationData={saveMutationData}
            />
          </div>
        </>
      }
      rightElements={
        <HeaderUI.DefaultButtonSpacing>
          <SubjectsPopover />
          <CollectionsPopover />
          <HeaderUI.VerticalBar />
          <AuthorsPopover />
          <HeaderUI.VerticalBar />
          <TagsPopover />
          <HeaderUI.VerticalBar />
          <UndoButton
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            undo={undo}
          />
          <SaveButton
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            save={save}
          />
          <HeaderUI.VerticalBar />
          <SettingsPopover />
        </HeaderUI.DefaultButtonSpacing>
      }
    />
  );
};

export default Header;

const PublishPopover = () => {
  const [{ publishStatus }, { togglePublishStatus }] =
    ArticleSlice.useContext();

  return (
    <PublishPopoverUnpopulated
      isPublished={publishStatus === "published"}
      toggleStatus={togglePublishStatus}
    />
  );
};

const DocLanguagesPopover = () => {
  const [, { addTranslation, removeTranslation }] = ArticleSlice.useContext();

  return (
    <DocLanguages.Popover
      docType="article"
      addLanguageToDoc={(languageId) => addTranslation({ languageId })}
      removeLanguageFromDoc={(languageId) => removeTranslation({ languageId })}
    />
  );
};

const SubjectsPopover = () => {
  const [{ languagesIds, subjectsIds }, { addSubject, removeSubject }] =
    ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <DocSubjectsPopover
      docActiveLanguageId={activeLanguageId}
      docLanguagesIds={languagesIds}
      docSubjectsIds={subjectsIds}
      docType="article"
      addSubjectToDoc={(subjectId) => addSubject({ subjectId })}
      removeSubjectFromDoc={(subjectId) => removeSubject({ subjectId })}
    >
      <SubjectsButton
        docLanguagesIds={languagesIds}
        docSubjectsIds={subjectsIds}
      />
    </DocSubjectsPopover>
  );
};

const CollectionsPopover = () => {
  const [
    { languagesIds, collectionsIds },
    { addCollection, removeCollection },
  ] = ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <DocCollectionsPopover
      docActiveLanguageId={activeLanguageId}
      docLanguagesIds={languagesIds}
      docCollectionsIds={collectionsIds}
      docType="article"
      addCollectionToDoc={(collectionId) => addCollection({ collectionId })}
      removeCollectionFromDoc={(collectionId) =>
        removeCollection({ collectionId })
      }
    >
      <CollectionsButton
        docCollectionsIds={collectionsIds}
        docLanguagesIds={languagesIds}
      />
    </DocCollectionsPopover>
  );
};

const AuthorsPopover = () => {
  const [{ authorsIds, languagesIds }, { addAuthor, removeAuthor }] =
    ArticleSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <DocAuthorsPopover
      docActiveLanguageId={activeLanguageId}
      docAuthorsIds={authorsIds}
      docLanguagesIds={languagesIds}
      docType="article"
      addAuthorToDoc={(authorId) => addAuthor({ authorId })}
      removeAuthorFromDoc={(authorId) => removeAuthor({ authorId })}
    >
      <AuthorsButton
        docAuthorsIds={authorsIds}
        docLanguagesIds={languagesIds}
      />
    </DocAuthorsPopover>
  );
};

const TagsPopover = () => {
  const [{ tagsIds }, { addTag, removeTag }] = ArticleSlice.useContext();

  return (
    <DocTagsPopover
      docType="article"
      removeTagFromDoc={(tagId) => removeTag({ tagId })}
      addTagToDoc={(tagId) => addTag({ tagId })}
      docTagsIds={tagsIds}
    >
      <TagsButton docTagsIds={tagsIds} />
    </DocTagsPopover>
  );
};

const SettingsPopover = () => {
  const [, { removeOne }] = ArticleSlice.useContext();

  return (
    <SettingsPopoverUnpopulated
      deleteDocFunc={removeOne}
      docType="collection"
    />
  );
};

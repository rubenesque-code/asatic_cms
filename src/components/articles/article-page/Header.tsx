import tw from "twin.macro";

import PublishPopoverUnpopulated from "^components/header/PublishPopover";
import SubjectsPopoverUnpopulated from "^components/header/SubjectsPopover";
import TagsPopoverUnpopulated from "^components/header/TagsPopover";
import SaveTextUI, {
  Props as SaveTextProps,
} from "^components/header/SaveTextUI";
import { HeaderGeneric } from "^components/header/Header";
import HeaderUI from "^components/header/HeaderUI";
import SettingsPopoverUnpopulated from "^components/header/SettingsPopover";
import UndoButton, {
  Props as UndoButtonProps,
} from "^components/header/UndoButton";
import SaveButton, {
  Props as SaveButtonProps,
} from "^components/header/SaveButton";
import { MyOmit } from "^types/utilities";
import DocLanguages from "^components/DocLanguages";
import CollectionsPopoverUnpopulated from "^components/header/CollectionsPopover";
import AuthorsPopoverUnpopulated from "^components/header/AuthorsPopover";
import ArticleSlice from "^context/articles/ArticleContext";

type Props = MyOmit<SaveButtonProps, "isLoadingSave"> &
  SaveTextProps &
  MyOmit<UndoButtonProps, "isLoadingSave">;

const Header = ({ isChange, save, saveMutationData, undo }: Props) => {
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
  const { activeLanguageId } = DocLanguages.useSelectContext();

  return (
    <SubjectsPopoverUnpopulated
      docActiveLanguageId={activeLanguageId}
      docLanguagesById={languagesIds}
      docSubjectsById={subjectsIds}
      docType="article"
      onAddSubjectToDoc={(subjectId) => addSubject({ subjectId })}
      onRemoveSubjectFromDoc={(subjectId) => removeSubject({ subjectId })}
    />
  );
};

const CollectionsPopover = () => {
  const [
    { languagesIds, collectionsIds },
    { addCollection, removeCollection },
  ] = ArticleSlice.useContext();
  const { activeLanguageId } = DocLanguages.useSelectContext();

  return (
    <CollectionsPopoverUnpopulated
      docActiveLanguageId={activeLanguageId}
      docLanguagesById={languagesIds}
      docCollectionsById={collectionsIds}
      docType="article"
      onAddCollectionToDoc={(collectionId) => addCollection({ collectionId })}
      onRemoveCollectionFromDoc={(collectionId) =>
        removeCollection({ collectionId })
      }
    />
  );
};

const AuthorsPopover = () => {
  const [{ authorsIds, languagesIds }, { addAuthor, removeAuthor }] =
    ArticleSlice.useContext();
  const { activeLanguageId } = DocLanguages.useSelectContext();

  return (
    <AuthorsPopoverUnpopulated
      docActiveLanguageId={activeLanguageId}
      docAuthorIds={authorsIds}
      docLanguageIds={languagesIds}
      onAddAuthorToDoc={(authorId) => addAuthor({ authorId })}
      onRemoveAuthorFromDoc={(authorId) => removeAuthor({ authorId })}
    />
  );
};

const TagsPopover = () => {
  const [{ tagsIds }, { addTag, removeTag }] = ArticleSlice.useContext();

  return (
    <TagsPopoverUnpopulated
      docTagsById={tagsIds}
      docType="collection"
      onRemoveFromDoc={(tagId) => removeTag({ tagId })}
      onAddToDoc={(tagId) => addTag({ tagId })}
    />
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

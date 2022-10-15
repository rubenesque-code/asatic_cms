import tw from "twin.macro";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import useRecordedEventsPageTopControls from "^hooks/pages/useRecordedEventPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import HeaderGeneric from "^components/header/Header";
import PublishPopoverUnpopulated from "^components/header/PublishPopover";
import SaveTextUI from "^components/header/mutation-text/SaveTextUI";
import HeaderUI from "^components/header/HeaderUI";
import SettingsPopoverUnpopulated from "^components/header/SettingsPopover";
import UndoButton from "^components/header/UndoButton";
import SaveButton from "^components/header/SaveButton";
// import AuthorsButton from "^components/header/secondary-content-buttons/AuthorsButton";
import TagsButton from "^components/header/secondary-content-buttons/TagsButton";
import SubjectsButton from "^components/header/secondary-content-buttons/SubjectsButton";
import CollectionsButton from "^components/header/secondary-content-buttons/CollectionsButton";

import DocLanguages from "^components/DocLanguages";
import DocSubjectsPopover from "^components/secondary-content-popovers/subjects";
// import DocAuthorsPopover from "^components/secondary-content-popovers/authors";
import DocTagsPopover from "^components/secondary-content-popovers/tags";
import DocCollectionsPopover from "^components/secondary-content-popovers/collections";

import AuthorsPopover_, {
  AuthorsPopoverButton_,
} from "^components/related-entity-popover/authors";
import $RelatedEntityButton_ from "^components/header/$RelatedEntityButton_";
import { AuthorIcon } from "^components/Icons";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useRecordedEventsPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <HeaderGeneric
      leftElements={
        <>
          <HeaderUI.DefaultButtonSpacing>
            <PublishPopover />
            <DocLanguagesPopover />
          </HeaderUI.DefaultButtonSpacing>
          <div css={[tw`ml-sm`]}>
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
    RecordedEventSlice.useContext();

  return (
    <PublishPopoverUnpopulated
      isPublished={publishStatus === "published"}
      toggleStatus={togglePublishStatus}
    />
  );
};

const entityType = "recorded-event";

const DocLanguagesPopover = () => {
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
    <DocSubjectsPopover
      docActiveLanguageId={activeLanguageId}
      docLanguagesIds={languagesIds}
      docSubjectsIds={subjectsIds}
      docType={entityType}
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
  ] = RecordedEventSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <DocCollectionsPopover
      docActiveLanguageId={activeLanguageId}
      docLanguagesIds={languagesIds}
      docCollectionsIds={collectionsIds}
      docType={entityType}
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
      <AuthorsPopoverButton_>
        {({ authorsStatus }) => (
          <$RelatedEntityButton_
            errors={typeof authorsStatus === "object" ? authorsStatus : null}
          >
            <AuthorIcon />
          </$RelatedEntityButton_>
        )}
      </AuthorsPopoverButton_>
    </AuthorsPopover_>
  );
};

const TagsPopover = () => {
  const [{ tagsIds }, { addTag, removeTag }] = RecordedEventSlice.useContext();

  return (
    <DocTagsPopover
      docType={entityType}
      removeTagFromDoc={(tagId) => removeTag({ tagId })}
      addTagToDoc={(tagId) => addTag({ tagId })}
      docTagsIds={tagsIds}
    >
      <TagsButton docTagsIds={tagsIds} />
    </DocTagsPopover>
  );
};

const SettingsPopover = () => {
  const [, { removeOne }] = RecordedEventSlice.useContext();

  return (
    <SettingsPopoverUnpopulated
      deleteDocFunc={removeOne}
      docType="collection"
    />
  );
};

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

import { AuthorIcon, CollectionIcon, TagIcon } from "^components/Icons";
import AuthorsPopover_, {
  AuthorsPopoverButton_,
} from "^components/related-entity-popover/authors";
import CollectionsPopover_, {
  CollectionsPopoverButton_,
} from "^components/related-entity-popover/collections";
import SubjectsPopover_, {
  SubjectsPopoverButton_,
} from "^components/related-entity-popover/subjects";
import TagsPopover_, {
  TagsPopoverButton_,
} from "^components/related-entity-popover/tags";

import $RelatedEntityButton_ from "^components/header/$RelatedEntityButton_";
import DocLanguages from "^components/DocLanguages";

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
      <SubjectsPopoverButton_>
        {({ subjectStatus }) => (
          <$RelatedEntityButton_
            errors={typeof subjectStatus === "object" ? subjectStatus : null}
          >
            <CollectionIcon />
          </$RelatedEntityButton_>
        )}
      </SubjectsPopoverButton_>
    </SubjectsPopover_>
  );
};

const CollectionsPopover = () => {
  const [
    { languagesIds, collectionsIds },
    { addCollection, removeCollection },
  ] = RecordedEventSlice.useContext();
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
      <CollectionsPopoverButton_>
        {({ entityCollectionsStatus }) => (
          <$RelatedEntityButton_
            errors={
              typeof entityCollectionsStatus === "object"
                ? entityCollectionsStatus.errors
                : null
            }
          >
            <CollectionIcon />
          </$RelatedEntityButton_>
        )}
      </CollectionsPopoverButton_>
    </CollectionsPopover_>
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
      <TagsPopoverButton_>
        {({ entityTagsStatus }) => (
          <$RelatedEntityButton_
            errors={
              typeof entityTagsStatus === "object" ? entityTagsStatus : null
            }
          >
            <TagIcon />
          </$RelatedEntityButton_>
        )}
      </TagsPopoverButton_>
    </TagsPopover_>
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

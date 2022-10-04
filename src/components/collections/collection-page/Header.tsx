import { Plus } from "phosphor-react";

import { useDispatch } from "^redux/hooks";
import { addCollection as addCollectionToArticle } from "^redux/state/articles";
import { addCollection as addCollectionToBlog } from "^redux/state/blogs";
import { addCollection as addCollectionToRecordedEvent } from "^redux/state/recordedEvents";

import CollectionSlice from "^context/collections/CollectionContext";

import useCollectionPageTopControls from "^hooks/pages/useCollectionPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import PublishPopoverUnpopulated from "^components/header/PublishPopover";
import SaveTextUI from "^components/header/mutation-text/SaveTextUI";
import HeaderGeneric from "^components/header/Header";
import HeaderUI from "^components/header/HeaderUI";
import SettingsPopoverUnpopulated from "^components/header/SettingsPopover";
import UndoButton from "^components/header/UndoButton";
import SaveButton from "^components/header/SaveButton";
import DocLanguages from "^components/DocLanguages";
import PrimaryContentPopover from "^components/add-primary-content-popover";
import ContentMenu from "^components/menus/Content";
import DocSubjectsPopover from "^components/secondary-content-popovers/subjects";
import SubjectsButton from "^components/header/secondary-content-buttons/SubjectsButton";
import DocTagsPopover from "^components/secondary-content-popovers/tags";
import TagsButton from "^components/header/secondary-content-buttons/TagsButton";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useCollectionPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <HeaderGeneric
      leftElements={
        <>
          <HeaderUI.DefaultButtonSpacing>
            <PublishPopover />
            <DocLanguagesPopover />
          </HeaderUI.DefaultButtonSpacing>
          <HeaderUI.MutationTextContainer>
            <SaveTextUI
              isChange={isChange}
              saveMutationData={saveMutationData}
            />
          </HeaderUI.MutationTextContainer>
        </>
      }
      rightElements={
        <HeaderUI.DefaultButtonSpacing>
          <AddPrimaryContentPopover />
          <HeaderUI.VerticalBar />
          <SubjectsPopover />
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
    CollectionSlice.useContext();

  return (
    <PublishPopoverUnpopulated
      isPublished={publishStatus === "published"}
      toggleStatus={togglePublishStatus}
    />
  );
};

const DocLanguagesPopover = () => {
  const [, { addTranslation, removeTranslation }] =
    CollectionSlice.useContext();

  return (
    <DocLanguages.Popover
      addLanguageToDoc={(languageId) => addTranslation({ languageId })}
      docType="collection"
      removeLanguageFromDoc={(languageId) => removeTranslation({ languageId })}
    />
  );
};

const AddPrimaryContentPopover = () => {
  const [{ id: collectionId }] = CollectionSlice.useContext();
  const dispatch = useDispatch();

  return (
    <PrimaryContentPopover
      docType="collection"
      addContentToDoc={({ docId, docType }) => {
        // addRelatedContentToCollection({ docId, docType });
        if (docType === "article") {
          dispatch(addCollectionToArticle({ collectionId, id: docId }));
        } else if (docType === "blog") {
          dispatch(addCollectionToBlog({ collectionId, id: docId }));
        } else if (docType === "recorded-event") {
          dispatch(addCollectionToRecordedEvent({ id: docId, collectionId }));
        }
      }}
    >
      <ContentMenu.Button tooltipProps={{ text: "add content" }}>
        <Plus />
      </ContentMenu.Button>
    </PrimaryContentPopover>
  );
};

const SubjectsPopover = () => {
  const [{ languagesIds, subjectsIds }, { addSubject, removeSubject }] =
    CollectionSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <DocSubjectsPopover
      docActiveLanguageId={activeLanguageId}
      docLanguagesIds={languagesIds}
      docSubjectsIds={subjectsIds}
      docType="collection"
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

const TagsPopover = () => {
  const [{ tagsIds }, { addTag, removeTag }] = CollectionSlice.useContext();

  return (
    <DocTagsPopover
      docType="collection"
      removeTagFromDoc={(tagId) => removeTag({ tagId })}
      addTagToDoc={(tagId) => addTag({ tagId })}
      docTagsIds={tagsIds}
    >
      <TagsButton docTagsIds={tagsIds} />
    </DocTagsPopover>
  );
};

const SettingsPopover = () => {
  const [, { removeOne }] = CollectionSlice.useContext();

  return (
    <SettingsPopoverUnpopulated
      deleteDocFunc={removeOne}
      docType="collection"
    />
  );
};

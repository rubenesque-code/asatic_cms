import tw from "twin.macro";
import { Plus } from "phosphor-react";

import CollectionSlice from "^context/collections/CollectionContext";

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
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useCollectionPageTopControls from "^hooks/pages/useCollectionPageTopControls";

// just do a custom table with all content (collections optional). Probs don't need status, etc

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
  return (
    <PrimaryContentPopover contextValue={{ docType: "collection" }}>
      <PrimaryContentPopover.Button>
        <ContentMenu.Button tooltipProps={{ text: "add content" }}>
          <Plus />
        </ContentMenu.Button>
      </PrimaryContentPopover.Button>
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

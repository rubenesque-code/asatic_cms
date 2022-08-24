import tw from "twin.macro";

import { useCollectionContext } from "^context/collections/CollectionContext";

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
import DocTranslations from "^components/DocTranslations";

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
            <DocTranslations.Popover />
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
  const [{ publishStatus }, { togglePublishStatus }] = useCollectionContext();

  return (
    <PublishPopoverUnpopulated
      isPublished={publishStatus === "published"}
      toggleStatus={togglePublishStatus}
    />
  );
};

const SubjectsPopover = () => {
  const [{ languagesIds, subjectsIds }, { addSubject, removeSubject }] =
    useCollectionContext();
  const [{ activeLanguageId }] = DocTranslations.useContext();

  return (
    <SubjectsPopoverUnpopulated
      docActiveLanguageId={activeLanguageId}
      docLanguagesById={languagesIds}
      docSubjectsById={subjectsIds}
      docType="collection"
      onAddSubjectToDoc={(subjectId) => addSubject({ subjectId })}
      onRemoveSubjectFromDoc={(subjectId) => removeSubject({ subjectId })}
    />
  );
};

const TagsPopover = () => {
  const [{ tagsIds }, { addTag, removeTag }] = useCollectionContext();

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
  const [, { removeOne }] = useCollectionContext();

  return (
    <SettingsPopoverUnpopulated
      deleteDocFunc={removeOne}
      docType="collection"
    />
  );
};

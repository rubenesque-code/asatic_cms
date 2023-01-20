import SubjectSlice from "^context/subjects/SubjectContext";

import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useSubjectPageTopControls from "^hooks/pages/useSubjectPageTopControls";
import useDeleteFromDbAndUpdateStore from "^hooks/subjects/useDeleteFromDbAndUpdateStore";

import {
  Header_,
  $DefaultButtonSpacing,
  $MutationTextContainer,
  $VerticalBar,
  $SaveText_,
  UndoButton_,
  SaveButton_,
} from "^components/header";
import {
  HeaderEntityPageSettingsPopover_,
  HeaderPublishPopover_,
  HeaderTagsPopover_,
  HeaderSubjectChildEntityPopover_,
} from "^components/header/popovers";
import { EntityName } from "^types/entity";
import { useSelector } from "^redux/hooks";
import { selectLanguageById } from "^redux/state/languages";
import tw from "twin.macro";
import { TranslateIcon } from "^components/Icons";

const entityName: EntityName = "subject";

const Header = () => {
  const {
    handleSave: save,
    handleUndo: undo,
    isChange,
    saveMutationData,
  } = useSubjectPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <Header_
      leftElements={
        <>
          <$DefaultButtonSpacing>
            <PublishPopover />
            <LanguageLabel />
          </$DefaultButtonSpacing>
          <$MutationTextContainer>
            <$SaveText_
              isChange={isChange}
              saveMutationData={saveMutationData}
            />
          </$MutationTextContainer>
        </>
      }
      rightElements={
        <$DefaultButtonSpacing>
          <DisplayEntityPopover />
          <$VerticalBar />
          <TagsPopover />
          <$VerticalBar />
          <UndoButton_
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            undo={undo}
          />
          <SaveButton_
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            save={save}
          />
          <$VerticalBar />
          <SettingsPopover />
        </$DefaultButtonSpacing>
      }
    />
  );
};

export default Header;

const PublishPopover = () => {
  const [{ publishStatus }, { togglePublishStatus }] =
    SubjectSlice.useContext();

  return (
    <HeaderPublishPopover_
      publishStatus={publishStatus}
      togglePublishStatus={togglePublishStatus}
    />
  );
};

const LanguageLabel = () => {
  const [{ languageId }] = SubjectSlice.useContext();

  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return (
    <div css={[tw`flex gap-xxxs items-center`]}>
      <span
        css={[
          tw`p-xxs rounded-full text-gray-500 text-base bg-white`,
          tw`text-sm -translate-y-1`,
        ]}
      >
        <TranslateIcon />
      </span>
      <p css={[tw`text-sm`]}>{language!.name}</p>
    </div>
  );
};

const DisplayEntityPopover = () => {
  const [
    {
      id: subjectId,
      articlesIds,
      blogsIds,
      collectionsIds,
      recordedEventsIds,
      languageId,
    },
    { addRelatedEntity: addRelatedEntityToSubject },
  ] = SubjectSlice.useContext();

  return (
    <HeaderSubjectChildEntityPopover_
      parentEntity={{
        actions: {
          addDisplayEntity: (relatedEntity) =>
            addRelatedEntityToSubject({ relatedEntity }),
        },
        data: {
          existingEntities: {
            articles: articlesIds,
            blogs: blogsIds,
            collections: collectionsIds,
            recordedEvents: recordedEventsIds,
          },
          id: subjectId,
          name: "subject",
          languageId,
        },
      }}
    />
  );
};

const TagsPopover = () => {
  const [
    { id, tagsIds },
    {
      addRelatedEntity: addRelatedEntityToSubject,
      removeRelatedEntity: removeRelatedEntityFromSubject,
    },
  ] = SubjectSlice.useContext();

  return (
    <HeaderTagsPopover_
      parentEntity={{
        addTag: (tagId) =>
          addRelatedEntityToSubject({
            relatedEntity: { id: tagId, name: "tag" },
          }),
        removeTag: (tagId) =>
          removeRelatedEntityFromSubject({
            relatedEntity: { id: tagId, name: "tag" },
          }),
        id,
        name: entityName,
        tagsIds,
      }}
    />
  );
};

const SettingsPopover = () => {
  const handleDeleteSubject = useDeleteFromDbAndUpdateStore();

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={handleDeleteSubject}
      entityType={entityName}
    />
  );
};

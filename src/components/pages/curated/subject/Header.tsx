import SubjectSlice from "^context/subjects/SubjectContext";

import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useSubjectPageTopControls from "^hooks/pages/useSubjectPageTopControls";
import useDeleteSubject from "^hooks/subjects/useDeleteSubject";

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
  HeaderDisplayEntityPopover_,
  HeaderEntityLanguagePopover_,
} from "^components/header/popovers";
import { EntityName } from "^types/entity";

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
            <LanguagesPopover />
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

const LanguagesPopover = () => {
  const [{ languagesIds }, { addTranslation, removeTranslation }] =
    SubjectSlice.useContext();

  return (
    <HeaderEntityLanguagePopover_
      parentEntity={{
        addTranslation: (languageId) =>
          addTranslation({ translation: { languageId } }),
        removeTranslation: (languageId) => removeTranslation({ languageId }),
        name: "subject",
        languagesIds,
      }}
    />
  );
};

const DisplayEntityPopover = () => {
  const [
    { id: subjectId, articlesIds, blogsIds, collectionsIds, recordedEventsIds },
    { addRelatedEntity: addRelatedEntityToSubject },
  ] = SubjectSlice.useContext();

  return (
    <HeaderDisplayEntityPopover_
      parentEntity={{
        actions: {
          addDisplayEntity: (relatedEntity) =>
            addRelatedEntityToSubject({ relatedEntity }),
        },
        data: {
          existingEntities: {
            articlesIds,
            blogsIds,
            collectionsIds,
            recordedEventsIds,
          },
          id: subjectId,
          name: "subject",
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
  const handleDeleteSubject = useDeleteSubject();

  return (
    <HeaderEntityPageSettingsPopover_
      deleteEntity={handleDeleteSubject}
      entityType={entityName}
    />
  );
};

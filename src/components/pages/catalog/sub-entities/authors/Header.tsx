import { useWriteMutationContext } from "./WriteMutationContext";
import { useDeleteMutationContext } from "./DeleteMutationContext";

import useMutationText from "^hooks/useMutationText";

import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useAuthorsPageSaveUndo from "^hooks/pages/useAuthorsPageUndoSave";

import {
  Header_,
  $SaveText_,
  UndoButton_,
  SaveButton_,
  $MutationTextContainer,
  $DefaultButtonSpacing,
  $MutationText_,
} from "^components/header";

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useAuthorsPageSaveUndo();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <Header_
      leftElements={
        <$MutationTextContainer>
          <$SaveText_ isChange={isChange} saveMutationData={saveMutationData} />
          <MutationText />
        </$MutationTextContainer>
      }
      rightElements={
        <$DefaultButtonSpacing>
          <UndoButton_
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            undo={handleUndo}
          />
          <SaveButton_
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            save={handleSave}
          />
        </$DefaultButtonSpacing>
      }
    />
  );
};

export default Header;

const MutationText = () => {
  const [, createMutationData] = useWriteMutationContext();
  const [, deleteMutationData] = useDeleteMutationContext();

  const { isError, isLoading, isSuccess, mutationType } = useMutationText({
    createMutationData,
    deleteMutationData,
  });

  return (
    <$MutationText_
      mutationData={{ isError, isLoading, isSuccess }}
      mutationType={mutationType}
    />
  );
};

import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useAuthorsPageSaveUndo from "^hooks/pages/useAuthorsPageUndoSave";

import {
  Header_,
  UndoButton_,
  SaveButton_,
  $MutationTextContainer,
  $DefaultButtonSpacing,
  $SaveText_,
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

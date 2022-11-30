import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useRecordedEventTypesPageUndoSave from "^hooks/pages/useRecordedEventTypesPageUndoSave";

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
    useRecordedEventTypesPageUndoSave();

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

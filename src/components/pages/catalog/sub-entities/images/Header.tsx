import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import useImagesPageTopControls from "^hooks/pages/useImagesPageTopControls";

import {
  Header_,
  $SaveText_,
  UndoButton_,
  SaveButton_,
  $MutationTextContainer,
  $DefaultButtonSpacing,
} from "^components/header";

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useImagesPageTopControls();

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

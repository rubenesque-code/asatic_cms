import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import {
  Header_,
  UndoButton_,
  SaveButton_,
  $MutationTextContainer,
  $DefaultButtonSpacing,
  $SaveText_,
} from "^components/header";
import useTagsPageSaveUndo from "^hooks/pages/useTagsPageSaveUndo";

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useTagsPageSaveUndo();

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

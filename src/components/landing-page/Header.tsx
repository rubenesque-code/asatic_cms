import useLandingPageTopControls from "^hooks/pages/useLandingPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import Header_ from "^components/header/_containers/Header_";
import $SaveText_ from "^components/header/_presentation/$SaveText_";
import {
  $MutationTextContainer,
  $DefaultButtonSpacing,
} from "^components/header/_styles";
import SaveButton from "^components/header/SaveButton";
import UndoButton from "^components/header/UndoButton";
import SiteLanguage from "^components/SiteLanguage";

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useLandingPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <Header_
      leftElements={
        <>
          <SiteLanguage.Popover />
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
          <UndoButton
            isChange={isChange}
            isLoadingSave={saveMutationData.isLoading}
            undo={handleUndo}
          />
          <SaveButton
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

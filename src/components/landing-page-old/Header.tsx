import tw from "twin.macro";

import useLandingPageTopControls from "^hooks/pages/useLandingPageTopControls";

import HeaderGeneric from "^components/header/Header";
import HeaderUI from "^components/header/HeaderUI";
import SaveTextUI from "^components/header/mutation-text/SaveTextUI";
import SaveButton from "^components/header/SaveButton";
import UndoButton from "^components/header/UndoButton";
import SiteLanguage from "^components/SiteLanguage";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useLandingPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <HeaderGeneric
      leftElements={
        <>
          <SiteLanguage.Popover />
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
        </HeaderUI.DefaultButtonSpacing>
      }
    />
  );
};

export default Header;

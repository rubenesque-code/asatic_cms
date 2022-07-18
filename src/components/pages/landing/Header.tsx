import { CloudArrowUp as CloudArrowUpIcon } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import SaveButtonUI from "^components/header/SaveButtonUI";
import SaveTextUI from "^components/header/SaveTextUI";
import SideBar from "^components/header/SideBar";
import UndoButtonUI from "^components/header/UndoButtonUI";
import useLandingPageTopControls from "^hooks/pages/useLandingPageTopControls";
import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import { s_header } from "^styles/header";

const Header = ({ siteLanguage }: { siteLanguage: ReactElement }) => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useLandingPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <header css={[s_header.container, tw`border-b`]}>
      <div css={[tw`flex items-center gap-md`]}>
        <SideBar />
        <div css={[s_header.spacing]}>
          {siteLanguage}
          <SaveTextUI isChange={isChange} saveMutationData={saveMutationData} />
        </div>
      </div>
      <div css={[s_header.spacing]}>
        <UndoButtonUI
          handleUndo={handleUndo}
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
        />
        <SaveButtonUI
          handleSave={handleSave}
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
        />
        <div css={[s_header.verticalBar]} />
        <button css={[s_header.button]}>
          <CloudArrowUpIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;

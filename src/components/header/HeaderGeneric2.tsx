import { ReactElement } from "react";
import { CloudArrowUp as CloudArrowUpIcon } from "phosphor-react";
import tw, { css } from "twin.macro";

import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import SideBar from "./SideBar";
import s_button from "^styles/button";

const HeaderGeneric2 = ({
  confirmBeforeLeavePage,
  leftButtons,
  rightButtons,
}: {
  leftButtons?: ReactElement;
  rightButtons?: ReactElement;
  confirmBeforeLeavePage: boolean;
}) => {
  useLeavePageConfirm({ runConfirmOn: confirmBeforeLeavePage });

  return (
    <HeaderGenericUI leftButtons={leftButtons} rightButtons={rightButtons} />
  );
};

export default HeaderGeneric2;

const HeaderGenericUI = ({
  leftButtons,
  rightButtons,
}: {
  leftButtons?: ReactElement;
  rightButtons?: ReactElement;
}) => (
  <header css={[s.container, tw`border-b`]}>
    <div css={[tw`flex items-center`]}>
      <div css={[tw`mr-md`]}>
        <SideBar />
      </div>
      {leftButtons ? leftButtons : null}
    </div>
    <div css={[tw`flex items-center gap-sm`]}>
      {rightButtons ? (
        <>
          {rightButtons}
          <div css={[s.verticalBar]} />
        </>
      ) : null}
      <button css={[s.button]}>
        <CloudArrowUpIcon />
      </button>
    </div>
  </header>
);

export const s = {
  container: tw`w-full flex items-center justify-between px-xs py-xxs`,
  button: css`
    ${s_button.icon} ${s_button.selectors}
  `,
  sectionSpacing: tw`flex items-center gap-sm`,
  verticalBar: tw`w-[0.5px] h-[22px] bg-gray-200`,
};

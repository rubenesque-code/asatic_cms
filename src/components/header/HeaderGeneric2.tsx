import { ReactElement } from "react";
import { CloudArrowUp as CloudArrowUpIcon } from "phosphor-react";
import tw, { css } from "twin.macro";

import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import SideBar from "./SideBar";
import s_button from "^styles/button";

const HeaderGeneric2 = ({
  confirmBeforeLeavePage,
  leftElements,
  rightElements,
}: {
  leftElements?: ReactElement;
  rightElements?: ReactElement;
  confirmBeforeLeavePage: boolean;
}) => {
  useLeavePageConfirm({ runConfirmOn: confirmBeforeLeavePage });

  return (
    <HeaderGenericUI
      leftElements={leftElements}
      rightElements={rightElements}
    />
  );
};

export default HeaderGeneric2;

const HeaderGenericUI = ({
  leftElements,
  rightElements,
}: {
  leftElements?: ReactElement;
  rightElements?: ReactElement;
}) => (
  <header css={[s.container, tw`border-b`]}>
    <div css={[tw`flex items-center`]}>
      <div css={[tw`mr-md`]}>
        <SideBar />
      </div>
      {leftElements ? leftElements : null}
    </div>
    <div css={[tw`flex items-center gap-sm`]}>
      {rightElements ? (
        <>
          {rightElements}
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

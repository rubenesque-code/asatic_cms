import { ReactElement } from "react";
import { CloudArrowUp as CloudArrowUpIcon } from "phosphor-react";
import tw, { css } from "twin.macro";

import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";

import SideBar from "./SideBar";
import s_button from "^styles/button";

const HeaderGeneric = ({
  children,
  confirmBeforeLeavePage,
}: {
  children: ReactElement;
  confirmBeforeLeavePage: boolean;
}) => {
  useLeavePageConfirm({ runConfirmOn: confirmBeforeLeavePage });

  return <HeaderGenericUI>{children}</HeaderGenericUI>;
};

export default HeaderGeneric;

const HeaderGenericUI = ({ children }: { children: ReactElement }) => (
  <header css={[s.container, tw`border-b`]}>
    <div css={[tw`mr-md`]}>
      <SideBar />
    </div>
    <div css={[tw`flex-grow`]}>{children}</div>
    <button css={[s.button, tw`ml-sm`]}>
      <CloudArrowUpIcon />
    </button>
  </header>
);

export const s = {
  container: tw`w-full flex items-center px-xs py-xxs`,
  button: css`
    ${s_button.icon} ${s_button.selectors}
  `,
  spacing: tw`flex items-center gap-sm`,
  verticalBar: tw`w-[0.5px] h-[30px] bg-gray-200`,
};

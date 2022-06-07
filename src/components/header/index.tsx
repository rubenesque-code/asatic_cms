import {
  CloudArrowUp,
  Gear,
  GitBranch,
  Tag,
  TagSimple,
  Translate,
  Upload,
} from "phosphor-react";
import tw, { css } from "twin.macro";
import s_button from "^styles/button";

import DeployPopover from "./DeployPopover";
import DocControls from "./DocControls";
import NavMenu from "./NavMenu";

// todo: make editor scrollbar further away. Line between article top section (title, author, ...) goes to end of written div rather than up to scrollbar
// todo: show if anything saved without deployed; if deploy error, success

const Header = () => {
  return (
    <header css={[s.header]}>
      <div css={[tw`flex gap-sm items-center`]}>
        <NavMenu />
        <p css={[tw`text-sm`]}>Draft</p>
        <div css={[tw`flex gap-xxxs items-center`]}>
          <button css={[s_button.subIcon, tw`text-sm -translate-y-1`]}>
            <Translate />
          </button>
          <p css={[tw`text-sm`]}>English</p>
        </div>
      </div>
      {/* <DeployPopover /> */}
      <div css={[tw`flex items-center gap-sm`]}>
        <div css={[tw`flex gap-sm`]}>
          <button css={[s.button]}>
            <GitBranch />
          </button>
          <button css={[s.button]}>
            <Gear />
          </button>
          <div css={[tw`w-[0.5px] h-[30px] bg-gray-200`]} />
          <DocControls />
        </div>
        <div css={[tw`w-[0.5px] h-[30px] bg-gray-200`]} />
        <button css={[s.button]}>
          <CloudArrowUp />
        </button>
      </div>
    </header>
  );
};

export default Header;

// drodown nav: page links + logout
// deploy panel: button
// undo + save
const s = {
  header: tw`flex items-center justify-between px-xs py-xxs`,
  button: css`
    ${s_button.icon} ${s_button.selectors}
  `,
};

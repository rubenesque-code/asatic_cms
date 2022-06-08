import {
  CloudArrowUp,
  Gear,
  GitBranch,
  Translate,
  Trash,
} from "phosphor-react";
import { ReactElement } from "react";
import tw, { css } from "twin.macro";
import WithProximityPopover from "^components/WithProximityPopover";
// import WithTags from "^components/WithTags";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import s_button from "^styles/button";

import DeployPopover from "./DeployPopover";
import DocControls from "./DocControls";
import NavMenu from "./NavMenu";

// todo: make editor scrollbar further away. Line between article top section (title, author, ...) goes to end of written div rather than up to scrollbar
// todo: show if anything saved without deployed; if deploy error, success

type SettingsProps = {
  onDelete: () => void;
};

const Header = ({
  settingsProps,
  withTags,
}: {
  settingsProps: SettingsProps;
  withTags: (button: ReactElement) => ReactElement;
}) => {
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
          {withTags(
            <button css={[s.button]}>
              <GitBranch />
            </button>
          )}
          <div css={[tw`w-[0.5px] h-[30px] bg-gray-200`]} />
          <DocControls />
        </div>
        <div css={[tw`w-[0.5px] h-[30px] bg-gray-200`]} />
        <Settings {...settingsProps} />
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

const Settings = (props: SettingsProps) => {
  return (
    <WithProximityPopover panelContentElement={<SettingsPanel {...props} />}>
      <WithTooltip text="settings">
        <button css={[s.button]}>
          <Gear />
        </button>
      </WithTooltip>
    </WithProximityPopover>
  );
};
const SettingsPanel = ({ onDelete }: SettingsProps) => {
  return (
    <div css={[tw`py-xs bg-white rounded-md border`]}>
      <div>
        <WithWarning
          callbackToConfirm={onDelete}
          warningText={{
            heading: "Delete article",
            body: "Are you sure you want to delete this article?",
          }}
        >
          <button
            className="group"
            css={[
              tw`px-sm py-xs flex gap-sm items-center hover:bg-gray-50 transition-colors ease-in-out duration-75`,
            ]}
          >
            <span>Delete article</span>
            <span
              css={[
                tw`group-hover:text-red-warning transition-colors ease-in-out duration-75`,
              ]}
            >
              <Trash />
            </span>
          </button>
        </WithWarning>
      </div>
    </div>
  );
};

import { Trash } from "phosphor-react";
import tw from "twin.macro";

import WithWarning from "^components/WithWarning";

import { s_menu } from "^styles/menus";
import { s_popover } from "^styles/popover";

const SettingsPanelUI = ({
  deleteFunc,
  docType,
}: {
  deleteFunc: () => void;
  docType: string;
}) => (
  <div css={[s_popover.panelContainer, tw`py-xs min-w-[25ch]`]}>
    <WithWarning
      callbackToConfirm={() => deleteFunc()}
      warningText={{
        heading: `Delete ${docType}`,
        body: "Are you sure you want? This can't be undone.",
      }}
    >
      <button
        className="group"
        css={[
          s_menu.listItemText,
          tw`w-full text-left px-sm py-xs flex gap-sm items-center transition-colors ease-in-out duration-75`,
        ]}
      >
        <span css={[tw`group-hover:text-red-warning`]}>
          <Trash />
        </span>
        <span>Delete {docType}</span>
      </button>
    </WithWarning>
  </div>
);

export default SettingsPanelUI;

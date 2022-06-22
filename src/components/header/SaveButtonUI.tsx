import { FloppyDisk } from "phosphor-react";
import tw from "twin.macro";

import WithTooltip from "^components/WithTooltip";

import { s_header } from "^styles/header";

const SaveButtonUI = ({
  handleSave,
  isChange,
  isLoadingSave,
}: {
  isLoadingSave: boolean;
  isChange: boolean;
  handleSave: () => void;
}) => {
  return (
    <WithTooltip
      text={isLoadingSave ? "saving..." : isChange ? "save" : "nothing to save"}
      type="action"
    >
      <button
        css={[
          s_header.button,
          (!isChange || isLoadingSave) && tw`text-gray-500 cursor-auto`,
        ]}
        onClick={handleSave}
        type="button"
      >
        <FloppyDisk />
      </button>
    </WithTooltip>
  );
};

export default SaveButtonUI;

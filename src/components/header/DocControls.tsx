import { ArrowUUpLeft, FloppyDisk } from "phosphor-react";
import tw, { css } from "twin.macro";

import { useDocTopLevelControlsContext } from "^context/DocTopLevelControlsContext";

import WithWarning from "^components/WithWarning";

import {
  buttonSelectors,
  buttonSelectorTransition,
  iconButtonDefault,
} from "^styles/common";
import WithTooltip from "^components/WithTooltip";

const DocControls = () => {
  return (
    <div css={[s.container]}>
      <Undo />
      <Save />
    </div>
  );
};

export default DocControls;

const Undo = () => {
  const { undo, isChange } = useDocTopLevelControlsContext();

  return (
    <WithWarning
      callbackToConfirm={undo.func}
      warningText={{
        heading: "Undo?",
        body: "This will undo all changes since last save for document(s) on this page.",
      }}
      disabled={!isChange}
    >
      {({ isOpen: warningIsOpen }) => (
        <WithTooltip
          text={isChange ? "undo" : "nothing to undo"}
          isDisabled={warningIsOpen}
        >
          <button
            css={[s.button.button, !isChange && s.button.disabled]}
            type="button"
          >
            <ArrowUUpLeft />
          </button>
        </WithTooltip>
      )}
    </WithWarning>
  );
};

const Save = () => {
  const { save, isChange } = useDocTopLevelControlsContext();
  const disabled = !isChange || save.saveMutationData.isLoading;

  return (
    <WithTooltip text={disabled ? "nothing to save" : "save"}>
      <button
        css={[s.button.button, disabled && s.button.disabled]}
        onClick={save.func}
        type="button"
      >
        <FloppyDisk />
      </button>
    </WithTooltip>
  );
};

const s = {
  container: tw`flex items-center gap-sm z-30`,
  button: {
    button: css`
      ${tw`z-30`}
      ${iconButtonDefault} ${buttonSelectors} ${buttonSelectorTransition}
    `,
    disabled: tw`text-gray-500 cursor-auto`,
  },
};

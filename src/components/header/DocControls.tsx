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
  const { undo, isChangeInDoc } = useDocTopLevelControlsContext();

  return (
    <WithWarning
      callbackToConfirm={undo.func}
      warningText={{
        heading: "Undo?",
        body: "This will undo all changes since last save for document(s) on this page.",
      }}
    >
      {({ isOpen: warningIsOpen }) => (
        <WithTooltip text="Undo" isDisabled={warningIsOpen}>
          <button css={[s.button]} disabled={!isChangeInDoc} type="button">
            <ArrowUUpLeft />
          </button>
        </WithTooltip>
      )}
    </WithWarning>
  );
};

const Save = () => {
  const { save, isChangeInDoc } = useDocTopLevelControlsContext();
  const disabled = !isChangeInDoc || save.isLoading;

  return (
    <WithTooltip text="save">
      <button
        css={[s.button]}
        onClick={save.func}
        disabled={disabled}
        type="button"
      >
        <FloppyDisk />
      </button>
    </WithTooltip>
  );
};

const s = {
  container: tw`flex items-center gap-sm z-30`,
  button: css`
    ${tw`z-30`}
    ${iconButtonDefault} ${buttonSelectors} ${buttonSelectorTransition}
  `,
};

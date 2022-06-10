import { ArrowUUpLeft, FloppyDisk } from "phosphor-react";
import tw, { css } from "twin.macro";

import { useDocTopLevelControlsContext } from "^context/DocTopLevelControlsContext";

import WithWarning from "^components/WithWarning";
import WithTooltip from "^components/WithTooltip";

import s_button from "^styles/button";

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
      callbackToConfirm={() => isChange && undo.func()}
      warningText={{
        heading: "Undo?",
        body: "This will undo all changes since last save for document(s) on this page.",
      }}
      disabled={!isChange}
    >
      {({ isOpen: warningIsOpen }) => (
        <WithTooltip
          text={
            isChange
              ? { header: "Undo", body: "Undo all changes since last save" }
              : "nothing to undo"
          }
          // type={!isChange && }
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
    <WithTooltip text={disabled ? "nothing to save" : "save"} type="action">
      <button
        css={[s.button.button, disabled && s.button.disabled]}
        onClick={() => !disabled && save.func()}
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
      ${s_button.icon} ${s_button.selectors}
      ${tw`z-30`}
    `,
    disabled: tw`text-gray-500 cursor-auto`,
  },
};

import { ArrowUUpLeft, FloppyDisk } from "phosphor-react";
import tw from "twin.macro";
import WithWarning from "^components/WithWarning";

import { useDocTopLevelControlsContext } from "^context/DocTopLevelControlsContext";

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
      <button css={[s.button]} disabled={!isChangeInDoc} type="button">
        <ArrowUUpLeft />
      </button>
    </WithWarning>
  );
};

const Save = () => {
  const { save, isChangeInDoc } = useDocTopLevelControlsContext();
  const disabled = !isChangeInDoc || save.isLoading;

  return (
    <button
      css={[s.button]}
      onClick={save.func}
      disabled={disabled}
      type="button"
    >
      <FloppyDisk />
    </button>
  );
};

const s = {
  container: tw`flex items-center gap-sm`,
  button: tw`text-lg p-xs hover:bg-gray-100 active:bg-gray-200 rounded-full`,
};

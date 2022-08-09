import { Trash as TrashIcon } from "phosphor-react";
import tw from "twin.macro";

import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";

import s_button from "^styles/button";
import s_transition from "^styles/transition";

const DeleteTranslationButtonUI = ({
  deleteFunc,
  show,
}: {
  deleteFunc: () => void;
  show: boolean;
}) => (
  <WithWarning
    callbackToConfirm={deleteFunc}
    warningText={{
      heading: "Delete translation?",
    }}
  >
    <WithTooltip text="delete translation">
      <button
        css={[
          s_transition.toggleVisiblity(show),
          tw`absolute z-10 bottom-0 right-0 translate-y-1/2 translate-x-1/2 p-xxs rounded-full text-sm text-gray-400 border`,
          s_button.deleteIconOnHover,
          tw`transition-all ease-in-out duration-75`,
        ]}
        type="button"
      >
        <TrashIcon />
      </button>
    </WithTooltip>
  </WithWarning>
);

export default DeleteTranslationButtonUI;

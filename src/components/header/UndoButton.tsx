import { ArrowUUpLeft } from "phosphor-react";

import WithWarning from "^components/WithWarning";
import Header from "./Header";

export type Props = {
  undo: () => void;
  isChange: boolean;
  isLoadingSave: boolean;
  // tooltipBodyText?: string;
};

const UndoButton = ({
  isChange,
  isLoadingSave,
  undo,
}: // tooltipBodyText = "This will undo all changes since last save.",
Props) => {
  const canUndo = isChange && !isLoadingSave;

  return (
    <WithWarning
      callbackToConfirm={undo}
      warningText={{
        heading: "Undo?",
        body: "This will undo all changes since last save.",
      }}
      type="moderate"
      disabled={!canUndo}
    >
      {({ isOpen: warningIsOpen }) => (
        <Header.IconButton
          buttonUI={{ isDisabled: !canUndo }}
          tooltip={{
            isDisabled: warningIsOpen,
            text: isChange
              ? {
                  header: "Undo",
                  body: "This will affect keywords but won't bring back deleted images nor remove uploaded ones.",
                }
              : "nothing to undo",
            type: "action",
          }}
        >
          <ArrowUUpLeft />
        </Header.IconButton>
      )}
    </WithWarning>
  );
};

export default UndoButton;

/*         <WithTooltip
          text={
            isChange
              ? {
                  header: "Undo",
                  body: "This will affect keywords but won't bring back deleted images nor remove uploaded ones.",
                }
              : "nothing to undo"
          }
          type="action"
          isDisabled={warningIsOpen}
        >
          <button
            css={[s_header.button, !canUndo && tw`text-gray-500 cursor-auto`]}
            type="button"
          >
            <ArrowUUpLeft />
          </button>
        </WithTooltip> */

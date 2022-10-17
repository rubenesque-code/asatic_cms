import { ArrowUUpLeft } from "phosphor-react";

import WithWarning from "^components/WithWarning";
import $IconButton_ from "./_presentation/$IconButton_";

export type Props = {
  undo: () => void;
  isChange: boolean;
  isLoadingSave: boolean;
};

const UndoButton = ({ isChange, isLoadingSave, undo }: Props) => {
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
        <$IconButton_
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
        </$IconButton_>
      )}
    </WithWarning>
  );
};

export default UndoButton;

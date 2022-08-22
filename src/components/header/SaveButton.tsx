import { FloppyDisk } from "phosphor-react";

import Header from "./Header";

export type Props = {
  isLoadingSave: boolean;
  isChange: boolean;
  save: () => void;
};

const SaveButton = ({ save, isChange, isLoadingSave }: Props) => {
  const canSave = isChange && !isLoadingSave;

  return (
    <Header.IconButton
      buttonUI={{ isDisabled: !canSave, highlight: canSave }}
      onClick={save}
      tooltip={{
        text: isLoadingSave
          ? "saving..."
          : isChange
          ? "save"
          : "nothing to save",
        type: "action",
      }}
    >
      <FloppyDisk />
    </Header.IconButton>
  );
};

export default SaveButton;

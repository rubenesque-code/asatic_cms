import { FloppyDisk } from "phosphor-react";
import tw from "twin.macro";

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
      buttonUI={{ isDisabled: !canSave }}
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
      <>
        <FloppyDisk />
        {canSave ? (
          <span
            css={[
              tw`absolute rounded-full top-0.5 right-0.5 w-[8px] h-[8px] bg-green-active`,
            ]}
          />
        ) : null}
      </>
    </Header.IconButton>
  );
};

export default SaveButton;

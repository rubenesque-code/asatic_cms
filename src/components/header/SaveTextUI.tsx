import { WarningCircle } from "phosphor-react";
import tw from "twin.macro";

import WithTooltip from "^components/WithTooltip";

const SaveTextUI = ({
  isChange,
  isLoadingSave,
  isSaveError,
  isSaveSuccess,
}: {
  isChange: boolean;
  isLoadingSave: boolean;
  isSaveError: boolean;
  isSaveSuccess: boolean;
}) => {
  return (
    <p css={[tw`text-sm text-gray-600`]}>
      {isLoadingSave ? (
        "saving..."
      ) : isSaveSuccess && !isChange ? (
        "saved"
      ) : isSaveError ? (
        <WithTooltip
          text={{
            header: "Save error",
            body: "Try saving again. If the problem persists, please contact the site developer.",
          }}
        >
          <span css={[tw`text-red-warning flex gap-xxs items-center`]}>
            <WarningCircle />
            <span>save error</span>
          </span>
        </WithTooltip>
      ) : null}
    </p>
  );
};

export default SaveTextUI;

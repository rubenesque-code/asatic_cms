import { WarningCircle } from "phosphor-react";
import tw from "twin.macro";

import WithTooltip from "^components/WithTooltip";

function SaveTextUI<
  SaveMutationType extends {
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
  }
>({
  isChange,
  saveMutationData,
}: {
  isChange: boolean;
  saveMutationData: SaveMutationType;
}) {
  const { isError, isLoading, isSuccess } = saveMutationData;
  return (
    <p css={[tw`text-sm text-gray-600`]}>
      {isLoading ? (
        "saving..."
      ) : isSuccess && !isChange ? (
        "saved"
      ) : isError ? (
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
}

export default SaveTextUI;

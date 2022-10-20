import { WarningCircle } from "phosphor-react";
import { useEffect, useState } from "react";
import tw from "twin.macro";

import WithTooltip from "^components/WithTooltip";

type SaveMutationData = {
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
};

export type Props = {
  isChange: boolean;
  saveMutationData: SaveMutationData;
};

export function $SaveText_({ isChange, saveMutationData }: Props) {
  const [successShownForSave, setSuccessShownForSave] = useState(false);

  const { isError, isLoading, isSuccess } = saveMutationData;

  useEffect(() => {
    if (isSuccess && isChange) {
      setSuccessShownForSave(true);
    }
  }, [isSuccess, isChange]);

  useEffect(() => {
    if (isLoading) {
      setSuccessShownForSave(false);
    }
  }, [isLoading]);

  return (
    <p css={[tw`text-sm text-gray-600`]}>
      {isLoading ? (
        "saving..."
      ) : isSuccess && !successShownForSave ? (
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

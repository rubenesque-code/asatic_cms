import { WarningCircle } from "phosphor-react";
import { useEffect, useState } from "react";
import tw from "twin.macro";

import WithTooltip from "^components/WithTooltip";

function DeleteTextUI<
  SaveMutationType extends {
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
  }
>({ mutationData }: { mutationData: SaveMutationType }) {
  const [showSuccessText, setShowSuccessText] = useState(false);

  const { isError, isLoading, isSuccess } = mutationData;

  useEffect(() => {
    if (isSuccess) {
      setShowSuccessText(true);
      setTimeout(() => {
        setShowSuccessText(false);
      }, 2500);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  if (!setShowSuccessText && !isError && !isLoading) {
    return null;
  }

  return (
    <p css={[tw`text-sm text-gray-600`]}>
      {isLoading ? (
        "deleting..."
      ) : showSuccessText ? (
        "deleted"
      ) : isError ? (
        <WithTooltip
          text={{
            header: "Delete error",
            body: "Try deleting again. If the problem persists, please contact the site developer.",
          }}
        >
          <span css={[tw`text-red-warning flex gap-xxs items-center`]}>
            <WarningCircle />
            <span>delete error</span>
          </span>
        </WithTooltip>
      ) : null}
    </p>
  );
}

export default DeleteTextUI;

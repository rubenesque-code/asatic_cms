import { WarningCircle } from "phosphor-react";
import { useEffect, useState } from "react";
import tw, { TwStyle } from "twin.macro";

import WithTooltip from "^components/WithTooltip";

function CreateTextUI<
  SaveMutationType extends {
    isError: boolean;
    isLoading: boolean;
    isSuccess: boolean;
  }
>({
  mutationData,
  containerStyles,
}: {
  mutationData: SaveMutationType;
  containerStyles?: TwStyle;
}) {
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
    <p css={[tw`text-sm text-gray-600`, containerStyles]}>
      {isLoading ? (
        "creating..."
      ) : showSuccessText ? (
        "created"
      ) : isError ? (
        <WithTooltip
          text={{
            header: "Create error",
            body: "Try creating again. If the problem persists, please contact the site developer.",
          }}
        >
          <span css={[tw`text-red-warning flex gap-xxs items-center`]}>
            <WarningCircle />
            <span>create error</span>
          </span>
        </WithTooltip>
      ) : null}
    </p>
  );
}

export default CreateTextUI;

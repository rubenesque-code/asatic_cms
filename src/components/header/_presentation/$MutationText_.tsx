import { WarningCircle } from "phosphor-react";
import tw from "twin.macro";

import WithTooltip from "^components/WithTooltip";

type MutationData = {
  isError: boolean;
  isLoading: boolean;
  isSuccess: boolean;
};

export const $MutationText_ = ({
  mutationData: { isError, isLoading, isSuccess },
  mutationType,
}: {
  mutationData: MutationData;
  mutationType: "save" | "delete" | null;
}) =>
  mutationType === null ? null : mutationType === "save" ? (
    <p css={[tw`text-sm text-gray-600`]}>
      {isLoading ? (
        "creating..."
      ) : isSuccess ? (
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
  ) : (
    <p css={[tw`text-sm text-gray-600`]}>
      {isLoading ? (
        "deleting..."
      ) : isSuccess ? (
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

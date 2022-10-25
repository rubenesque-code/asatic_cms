import { PrimaryEntityStatus } from "^types/primary-entity";

import StatusLabel from "^components/StatusLabel";
import tw, { TwStyle } from "twin.macro";

export const Status_ = ({
  publishDate,
  status,
  styles,
}: {
  publishDate: Date | undefined;
  status: PrimaryEntityStatus;
  styles?: TwStyle;
}) => {
  if (status === "good") {
    return null;
  }
  return (
    <div css={[tw`text-sm flex`, styles]}>
      <StatusLabel publishDate={publishDate} status={status} onlyShowUnready />
    </div>
  );
};

import { DisplayEntityStatus as DisplayEntityStatus_ } from "^types/display-entity";
import { CollectionError } from "^types/collection";
import { PrimaryEntityError } from "^types/primary-entity";

import StatusLabel from "^components/StatusLabel";
import tw, { TwStyle } from "twin.macro";

type DisplayEntityStatus = DisplayEntityStatus_<
  PrimaryEntityError | CollectionError
>;

export const Status_ = ({
  publishDate,
  status,
  styles,
}: {
  publishDate: Date | undefined;
  status: DisplayEntityStatus;
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

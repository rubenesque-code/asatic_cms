import tw from "twin.macro";

import { ArticleLikeStatus } from "^types/article-like-entity";
import { RecordedEventStatus } from "^types/recordedEvent";
import { CollectionStatus } from "^types/collection";

import StatusLabel from "^components/StatusLabel";

import { $status } from "../../_styles/$summary";

type DisplayEntityStatus =
  | ArticleLikeStatus
  | CollectionStatus
  | RecordedEventStatus;

export const Status_ = ({
  publishDate,
  status,
}: {
  publishDate: Date | undefined;
  status: DisplayEntityStatus;
}) => {
  if (status === "good") {
    return null;
  }
  return (
    <div css={[tw`mt-sm text-sm flex justify-start`, $status]}>
      <StatusLabel publishDate={publishDate} status={status} onlyShowUnready />
    </div>
  );
};

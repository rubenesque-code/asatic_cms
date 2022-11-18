import tw, { TwStyle } from "twin.macro";

import { ArticleLikeStatus } from "^types/article-like-entity";
import { RecordedEventStatus } from "^types/recordedEvent";
import { CollectionStatus } from "^types/collection";

import StatusLabel from "^components/StatusLabel";

type DisplayEntityStatus =
  | ArticleLikeStatus
  | CollectionStatus
  | RecordedEventStatus;

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

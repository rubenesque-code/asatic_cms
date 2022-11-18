import { Info } from "phosphor-react";
import tw from "twin.macro";

import { formatDateTimeAgo } from "^helpers/general";

import { ArticleLikeStatus } from "^types/article-like-entity";
import { RecordedEventStatus } from "^types/recordedEvent";
import { CollectionStatus } from "^types/collection";

import WithTooltip from "./WithTooltip";

type DisplayEntityStatus =
  | ArticleLikeStatus
  | CollectionStatus
  | RecordedEventStatus;

export default function StatusLabel({
  publishDate,
  status,
  onlyShowUnready = false,
}: {
  publishDate: Date | undefined;
  status: DisplayEntityStatus;
  onlyShowUnready?: boolean;
}) {
  return (
    <>
      {status === "new" ? (
        onlyShowUnready ? (
          <StatusDraft />
        ) : (
          <StatusNew />
        )
      ) : status === "draft" ? (
        <StatusDraft />
      ) : status === "invalid" ? (
        <StatusInvalid />
      ) : typeof status === "object" && status.status === "warning" ? (
        <StatusWarning />
      ) : onlyShowUnready ? null : (
        <StatusGood publishDate={publishDate!} />
      )}
    </>
  );
}

const StatusLabelUI = tw.div`text-center rounded-lg py-0.5 px-2 font-sans`;

function StatusNew() {
  return <StatusLabelUI tw={"bg-blue-200 text-blue-500"}>new</StatusLabelUI>;
}

function StatusDraft() {
  return (
    <WithTooltip
      text="This document isn't published and won't be shown on the site."
      type="extended-info"
    >
      <StatusLabelUI tw={"bg-gray-200 text-gray-500 cursor-help"}>
        draft
      </StatusLabelUI>
    </WithTooltip>
  );
}

function StatusGood({ publishDate }: { publishDate: Date }) {
  return (
    <StatusLabelUI tw={"bg-green-200 text-green-500"}>
      <>Published {formatDateTimeAgo(publishDate)}</>
    </StatusLabelUI>
  );
}

function StatusInvalid() {
  return (
    <WithTooltip
      text={{
        header: "Invalid Document",
        body: `This document is published but doesn't have the required fields. It won't be shown on the website.`,
      }}
    >
      <StatusLabelUI
        tw={"bg-red-200 text-red-500 flex items-center gap-xxs cursor-help"}
      >
        invalid
      </StatusLabelUI>
    </WithTooltip>
  );
}

function StatusWarning() {
  return (
    <StatusLabelUI
      tw={"bg-orange-200 text-orange-500 flex items-center gap-xxs"}
    >
      errors
      <span css={[tw`text-gray-500`]}>
        <WithTooltip
          text={{
            header: "Document errors",
            body: `This document is published but has errors. It's still valid and will be shown on the website.`,
          }}
        >
          <Info />
        </WithTooltip>
      </span>
    </StatusLabelUI>
  );
}

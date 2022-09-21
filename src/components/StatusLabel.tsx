import { Info } from "phosphor-react";
import tw from "twin.macro";
import { formatDateTimeAgo } from "^helpers/general";

import {
  DisplayContentErrors,
  DisplayContentStatus,
} from "^types/display-content";
import WithTooltip from "./WithTooltip";

export default function StatusLabel({
  publishDate,
  status,
}: {
  publishDate: Date | undefined;
  status: DisplayContentStatus;
}) {
  return (
    <>
      {status === "new" ? (
        <StatusNew />
      ) : status === "draft" ? (
        <StatusDraft />
      ) : status === "invalid" ? (
        <StatusInvalid />
      ) : typeof status === "object" && status.status === "error" ? (
        <StatusError docErrors={status.errors} />
      ) : (
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
  return <StatusLabelUI tw={"bg-gray-200 text-gray-500"}>draft</StatusLabelUI>;
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
    <StatusLabelUI tw={"bg-red-200 text-red-500 flex items-center gap-xxs"}>
      invalid
      <span css={[tw`text-gray-500`]}>
        <WithTooltip
          text={{
            header: "Invalid Document",
            body: `This document is published but has no valid translation. It won't be shown on the website.`,
          }}
        >
          <Info />
        </WithTooltip>
      </span>
    </StatusLabelUI>
  );
}

function StatusError({
  docErrors,
}: {
  docErrors: DisplayContentErrors["errors"];
}) {
  return (
    <StatusLabelUI
      tw={"bg-orange-200 text-orange-500 flex items-center gap-xxs"}
    >
      errors
      <span css={[tw`text-gray-500`]}>
        <WithTooltip
          text={{
            header: "Document errors",
            body: `This document is published but has errors. It's still valid and will be shown on the website. Errors: ${docErrors.join(
              ", "
            )}`,
          }}
        >
          <Info />
        </WithTooltip>
      </span>
    </StatusLabelUI>
  );
}

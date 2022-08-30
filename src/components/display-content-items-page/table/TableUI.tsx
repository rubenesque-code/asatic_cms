import { FileText, Info, Trash } from "phosphor-react";
import { ReactElement } from "react";
import tw from "twin.macro";
import ContentMenu from "^components/menus/Content";
import WithTooltip from "^components/WithTooltip";
import WithWarning from "^components/WithWarning";
import { formatDateTimeAgo } from "^helpers/general";
import {
  DisplayContentErrors,
  DisplayContentStatus,
} from "^types/display-content";
import CellContainerUI from "./CellContainerUI";

type OptionalColumn = "authors" | "collections";

export default function TableUI({
  children: contentRows,
  isFilter,
  optionalColumns,
}: {
  children: ReactElement[];
  isFilter: boolean;
  optionalColumns?: [OptionalColumn, OptionalColumn] | [OptionalColumn];
}) {
  return (
    <div
      css={[s.container, optionalColumns && s_colSpan(optionalColumns.length)]}
    >
      <div css={s.columnTitle}>Title</div>
      <div css={s.columnTitle}>Actions</div>
      <div css={s.columnTitle}>Status</div>
      {optionalColumns?.includes("authors") ? (
        <div css={s.columnTitle}>Authors</div>
      ) : null}
      <div css={s.columnTitle}>Subjects</div>
      {optionalColumns?.includes("collections") ? (
        <div css={s.columnTitle}>Collections</div>
      ) : null}
      <div css={s.columnTitle}>Tags</div>
      <div css={s.columnTitle}>Translations</div>
      {contentRows.length ? (
        contentRows
      ) : !isFilter ? (
        <p css={[s.noEntriesPlaceholder]}>- No entries yet -</p>
      ) : (
        <p css={[s.noEntriesPlaceholder]}>- No entries for filter -</p>
      )}
      <div css={[s.bottomSpacingForScrollBar]} />
    </div>
  );
}

const s = {
  container: tw`grid grid-cols-expand8 overflow-x-auto overflow-y-hidden`,
  columnTitle: tw`py-3 px-sm text-center font-bold uppercase tracking-wider text-gray-700 text-sm bg-gray-200`,
  noEntriesPlaceholder: tw`text-center col-span-8 uppercase text-xs py-3`,
  bottomSpacingForScrollBar: tw`col-span-8 h-10 bg-white border-white`,
};

const s_colSpan = (numOptionalCols: 0 | 1 | 2) =>
  numOptionalCols === 0
    ? tw`col-span-6`
    : numOptionalCols === 1
    ? tw`col-span-7`
    : tw`col-span-8`;

TableUI.Cell = tw.div`py-2 text-gray-600 flex items-center justify-center border whitespace-nowrap px-sm`;

TableUI.ActionsCell = function ActionsCell({
  deleteDoc,
  docType,
  routeToEditPage,
}: {
  deleteDoc: () => void;
  docType: string;
  routeToEditPage: () => void;
}) {
  return (
    <TableUI.Cell>
      <div css={[tw`flex gap-xs justify-center items-center`]}>
        <ContentMenu.Button
          onClick={routeToEditPage}
          tooltipProps={{ text: `edit ${docType}` }}
        >
          <FileText />
        </ContentMenu.Button>
        <WithWarning
          callbackToConfirm={deleteDoc}
          warningText={{
            heading: `Delete ${docType}?`,
            body: "This action can't be undone.",
          }}
          width={tw`w-['20ch'] min-w-['20ch']`}
        >
          <ContentMenu.Button
            tooltipProps={{ text: `delete ${docType}`, yOffset: 10 }}
          >
            <Trash />
          </ContentMenu.Button>
        </WithWarning>
      </div>
    </TableUI.Cell>
  );
};

TableUI.StatusCell = function StatusCell({
  publishDate,
  status,
}: {
  publishDate: Date | undefined;
  status: DisplayContentStatus;
}) {
  return (
    <CellContainerUI>
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
    </CellContainerUI>
  );
};

const StatusLabel = tw.div`text-center rounded-lg py-0.5 px-2`;

function StatusNew() {
  return <StatusLabel tw={"bg-blue-200 text-blue-500"}>new</StatusLabel>;
}

function StatusDraft() {
  return <StatusLabel tw={"bg-gray-200 text-gray-500"}>draft</StatusLabel>;
}

function StatusGood({ publishDate }: { publishDate: Date }) {
  return (
    <StatusLabel tw={"bg-green-200 text-green-500"}>
      <>Published {formatDateTimeAgo(publishDate)}</>
    </StatusLabel>
  );
}

function StatusInvalid() {
  return (
    <StatusLabel tw={"bg-red-200 text-red-500 flex items-center gap-xxs"}>
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
    </StatusLabel>
  );
}

function StatusError({
  docErrors,
}: {
  docErrors: DisplayContentErrors["errors"];
}) {
  return (
    <StatusLabel tw={"bg-orange-200 text-orange-500 flex items-center gap-xxs"}>
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
    </StatusLabel>
  );
}

// TableUI.CellSubDocsList = tw.div`flex gap-sm`;
export const s_table = {
  cellSubDocsList: tw`flex gap-xxs`,
};

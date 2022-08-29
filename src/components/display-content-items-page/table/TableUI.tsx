import { ReactElement } from "react";
import tw from "twin.macro";

type optionalColumn = "authors" | "collections";

export default function TableUI({
  children: contentRows,
  isFilter,
  optionalColumns,
}: {
  children: ReactElement[];
  isFilter: boolean;
  optionalColumns?: [optionalColumn, optionalColumn] | [optionalColumn];
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

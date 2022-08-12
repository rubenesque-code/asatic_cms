import { ReactElement } from "react";
import tw from "twin.macro";

const TableUI = ({
  children,
  isContentPostFilter,
  isContentPrefilter,
}: {
  children: ReactElement;
  isContentPostFilter: boolean;
  isContentPrefilter: boolean;
}) => (
  <div css={[s.container]}>
    <div css={s.columnTitle}>Title</div>
    <div css={s.columnTitle}>Actions</div>
    <div css={s.columnTitle}>Status</div>
    <div css={s.columnTitle}>Authors</div>
    <div css={s.columnTitle}>Subjects</div>
    <div css={s.columnTitle}>Collections</div>
    <div css={s.columnTitle}>Tags</div>
    <div css={s.columnTitle}>Translations</div>
    {isContentPostFilter ? (
      children
    ) : !isContentPrefilter ? (
      <p css={[s.noEntriesPlaceholder]}>- No entries yet -</p>
    ) : (
      <p css={[s.noEntriesPlaceholder]}>- No entries for filter -</p>
    )}
    <div css={[s.bottomSpacingForScrollBar]} />
  </div>
);

export default TableUI;

const s = {
  container: tw`grid grid-cols-expand8 overflow-x-auto overflow-y-hidden`,
  columnTitle: tw`py-3 px-sm text-center font-bold uppercase tracking-wider text-gray-700 text-sm bg-gray-200`,
  noEntriesPlaceholder: tw`text-center col-span-8 uppercase text-xs py-3`,
  bottomSpacingForScrollBar: tw`col-span-8 h-10 bg-white border-white`,
};

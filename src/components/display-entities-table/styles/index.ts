import tw, { styled } from "twin.macro";

type NumColumns = 5 | 6 | 7 | 8;
const $gridColumns = (numColumns: NumColumns) =>
  numColumns === 5
    ? tw`grid-cols-expand5`
    : numColumns === 6
    ? tw`grid-cols-expand6`
    : numColumns === 7
    ? tw`grid-cols-expand7`
    : tw`grid-cols-expand8`;

export const $TableContainer = styled.div(
  ({ numColumns }: { numColumns: NumColumns }) => [
    tw`grid max-w-full overflow-y-hidden`,
    $gridColumns(numColumns),
  ]
);

export const $HeaderCell = tw.div`py-3 px-sm text-center font-bold uppercase tracking-wider text-gray-700 text-sm bg-gray-200`;

const $gridColumnSpan = (numColumns: NumColumns) =>
  numColumns === 5
    ? tw`col-span-5`
    : numColumns === 6
    ? tw`col-span-6`
    : numColumns === 7
    ? tw`col-span-7`
    : tw`col-span-8`;

export const $NoEntriesText = styled.p(
  ({ numColumns }: { numColumns: NumColumns }) => [
    tw`text-center uppercase text-xs py-3`,
    $gridColumnSpan(numColumns),
  ]
);

export const $BottomSpacingForScrollbar = styled.p(
  ({ numColumns }: { numColumns: NumColumns }) => [
    tw`h-10 bg-white border-white`,
    $gridColumnSpan(numColumns),
  ]
);

export const $Cell = tw.div`max-w-[300px] py-2 text-gray-600 flex items-center justify-center border whitespace-nowrap px-sm`;

// export const $StatusLabel = tw.div`text-center rounded-lg py-0.5 px-2`;

export const $itemsList = tw`flex gap-xxs`;

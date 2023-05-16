import tw from "twin.macro";

export const $DocumentContainer = tw.div`relative h-full flex flex-col`;

export const $DocumentHeaderContainer = tw.div`flex flex-col items-start gap-sm pt-lg pb-md border-b`;

export const $Date = tw.div`font-sans`;

export const $Title = tw.div`text-3xl font-medium w-full font-serif-eng`;

export const $Authors = tw.div`text-xl font-serif-eng cursor-pointer`;

export const $BodyPopulatedContainer = tw.div`mt-md flex flex-col gap-md`;

export const $Caption = tw.div`mt-xs border-l-2 border-gray-400 pl-xs text-gray-600`;

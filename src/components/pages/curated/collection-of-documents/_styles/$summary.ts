import tw from "twin.macro";

export const $summaryContainer = tw`relative h-full overflow-hidden flex flex-col px-sm py-sm border`;

export const $status = tw`flex text-sm mb-xs justify-end`;
export const $Status = tw.div`flex text-sm mb-xs`;

export const $Title = tw.div`text-2xl font-serif-eng`;

export const $authors = tw`text-xl text-gray-400 font-serif-eng mt-xxs`;
export const $Authors = tw.div`text-xl text-gray-400 font-serif-eng mt-xxs flex-wrap`;

export const $Text = tw.div`font-serif-eng text-base mt-xs prose`;

export const $imageContainer = tw`relative px-xs pt-xs mb-xs aspect-ratio[16/9]`;

export const $RecordedEventVideoType = tw.div`uppercase mb-xxxs tracking-wider text-gray-700`;

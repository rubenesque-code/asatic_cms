import tw from "twin.macro";

export const $Container = tw.article`h-full flex flex-col font-serif-eng`;

export const $Header = tw.div`flex flex-col items-start gap-xs pt-lg pb-md border-b`;

export const $VideoTypeHeading = tw.div`uppercase text-sm tracking-widest cursor-pointer`;

export const $Date = tw.div`uppercase text-sm tracking-wide font-sans`;

export const $Title = tw.div`text-4xl font-serif-eng w-full`;

export const $Authors = tw.div`text-xl font-serif-eng`;

export const $Body = tw.div`flex flex-col flex-grow`;

export const $VideoSection = tw.div`py-lg border-t border-b border-gray-200`;

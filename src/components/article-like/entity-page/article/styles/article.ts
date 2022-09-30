import tw from "twin.macro";

export const Container = tw.div`relative h-full flex flex-col font-serif-eng`;

export const HeaderContainer = tw.div`flex flex-col items-start gap-sm pt-lg pb-md border-b`;

export const Date = tw.div`font-sans`;

export const Title = tw.div`text-3xl font-medium w-full`;

export const Authors = tw.div`text-xl`;

export const BodyContainer = tw.div`mt-md`;

export const ImageContainer = tw.div`w-full h-full`;

export const Caption = tw.div`mt-xs border-l border-gray-500 pl-xs text-gray-700`;

export const bodySectionMenu = tw`top-0 right-0`;

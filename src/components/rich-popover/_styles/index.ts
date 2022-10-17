import tw, { styled } from "twin.macro";

export const $PanelContainer = tw.div`p-md bg-white shadow-lg rounded-md border font-sans w-[700px] max-w-[96vw]`;

export const $Heading = tw.h4`font-medium text-lg`;
export const $description = tw`text-gray-600 mt-xs text-sm`;
export const $Description = styled.p([$description]);

export const $RelatedEntityText = tw.p`text-sm mt-sm`;
export const $NoRelatedEntityText = tw($RelatedEntityText)`text-gray-800`;

export const $InputSelectComboContainer = tw.div`mt-lg`;

import tw from "twin.macro";

export const $PanelContainer = tw.div`p-md bg-white shadow-lg rounded-md border font-sans`;

export const $InputSelectComboContainer = tw.div`mt-lg`;

export const $Heading = tw.h4`font-medium text-lg`;
export const $Description = tw.p`text-gray-600 mt-xs text-sm`;
export const $RelatedEntityText = tw.p`text-sm mt-sm`;
export const $NoRelatedEntityText = tw($RelatedEntityText)`text-gray-800`;

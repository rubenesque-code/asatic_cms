import tw, { styled } from "twin.macro";

export const $Container = tw.div`w-full flex items-center justify-between px-xs py-xxs border-b`;

export const $DefaultButtonSpacing = tw.div`flex items-center gap-sm`;

export const $ButtonText = tw.span`text-sm`;

export const $VerticalBar = tw.div`w-[0.5px] h-[22px] bg-gray-200`;

export const $menuButtonSelectors = tw`hover:bg-gray-100 active:bg-gray-200 transition-all ease-in-out duration-75`;

export type IconButtonProps = {
  isDisabled?: boolean;
};

export const $IconButton = styled.div(({ isDisabled }: IconButtonProps) => [
  tw`relative p-xs rounded-full bg-white text-lg cursor-pointer grid place-items-center`,
  $menuButtonSelectors,
  isDisabled && tw`text-gray-500 cursor-auto`,
]);

export const $MutationTextContainer = tw.div`ml-sm`;

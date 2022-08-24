import tw, { styled } from "twin.macro";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function HeaderUI() {}

HeaderUI.Container = tw.div`w-full flex items-center justify-between px-xs py-xxs border-b`;

HeaderUI.DefaultButtonSpacing = tw.div`flex items-center gap-sm`;

HeaderUI.VerticalBar = tw.div`w-[0.5px] h-[22px] bg-gray-200`;

const s_menuButtonSelectors = tw`hover:bg-gray-100 active:bg-gray-200 transition-all ease-in-out duration-75`;

export type UIIconButtonProps = {
  isDisabled?: boolean;
};

HeaderUI.IconButton = styled.button(({ isDisabled }: UIIconButtonProps) => [
  tw`relative p-xs rounded-full bg-white text-lg`,
  s_menuButtonSelectors,
  isDisabled && tw`text-gray-500 cursor-auto`,
]);

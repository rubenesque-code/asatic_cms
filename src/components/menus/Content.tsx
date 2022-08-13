import { ReactElement } from "react";
import tw, { css, TwStyle } from "twin.macro";
import WithTooltip, { TooltipProps } from "^components/WithTooltip";

import s_button from "^styles/button";

export const ContentMenuContainer = ({
  children,
  containerStyles,
  show,
}: {
  children: ReactElement | ReactElement[];
  containerStyles?: TwStyle;
  show: boolean;
}) => <menu css={[s.container({ show }), containerStyles]}>{children}</menu>;

export const ContentMenuButton = ({
  children,
  isDisabled = false,
  onClick,
  tooltipProps,
}: {
  children: ReactElement;
  isDisabled?: boolean;
  onClick?: () => void;
  tooltipProps: TooltipProps;
}) => (
  <WithTooltip {...tooltipProps}>
    <button
      css={[s.button({ isDisabled })]}
      onClick={() => onClick && !isDisabled && onClick()}
      type="button"
    >
      {children}
    </button>
  </WithTooltip>
);

export const ContentMenuVerticalBar = () => <div css={[s.verticalBar]} />;

const s = {
  container: ({ show }: { show: boolean }) => css`
    ${tw`absolute z-30 px-sm py-xs inline-flex items-center gap-sm bg-white rounded-md shadow-md border`}
    ${tw`opacity-70 hover:opacity-100 hover:z-40 text-gray-400 hover:text-black transition-opacity ease-in-out duration-75`}
      ${!show && tw`opacity-0`},
  `,
  button: (args: { isDisabled?: boolean } | void) => css`
    ${s_button.icon} ${s_button.selectors} ${tw`text-[15px] p-xxs`} ${args?.isDisabled &&
    tw`cursor-auto text-gray-disabled`}
  `,
  verticalBar: tw`w-[0.5px] h-[15px] bg-gray-200`,
};

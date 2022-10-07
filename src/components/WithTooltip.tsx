// import "react-popper-tooltip/dist/styles.css";
import { cloneElement, ReactElement, ComponentProps } from "react";
import { usePopperTooltip, Config } from "react-popper-tooltip";
import tw from "twin.macro";

import s_transition from "^styles/transition";

export type Props = {
  yOffset?: number;
  children: ReactElement;
  placement?: Config["placement"];
  text:
    | string
    | {
        header: string;
        body: string;
      };
  isDisabled?: boolean;
  type?: "info" | "action" | "extended-info";
};

const WithTooltip = ({
  children,
  placement = "auto",
  text,
  isDisabled = false,
  yOffset = 10,
  type = "info",
}: Props) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({ delayShow: 700, placement, offset: [0, yOffset] });

  const show = visible && !isDisabled;

  return (
    <>
      {cloneElement(children, {
        ...children.props,
        ref: setTriggerRef,
      })}
      <div
        css={[s.container, s_transition.toggleVisiblity(show)]}
        {...getTooltipProps()}
        ref={setTooltipRef}
      >
        {typeof text === "string" ? (
          <div
            css={[
              type === "info" && s.info,
              type === "action" && s.action,
              type === "extended-info" && s.extendedInfo,
            ]}
          >
            {text}
          </div>
        ) : (
          <div css={[s.extended.container]}>
            <p css={[tw`font-medium capitalize`]}>{text.header}</p>
            <p css={[tw`text-gray-600`]}>{text.body}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default WithTooltip;

const s = {
  container: tw`z-50 text-sm font-sans rounded-sm whitespace-nowrap transition-opacity ease-in-out duration-75 shadow-lg`,
  info: tw`py-0.5 px-2 text-white bg-gray-700`,
  action: tw`py-0.5 px-2 border border-gray-600 bg-[#fafafa] text-gray-700`,
  extendedInfo: tw`py-0.5 px-2 border border-blue-600 bg-[#fafafa] text-blue-900`,
  extended: {
    container: tw`text-left py-0.5 px-2 border border-gray-600 bg-[#fafafa] text-gray-700 flex flex-col gap-xxs w-[30ch] whitespace-normal`,
  },
};

export type TooltipProps = Omit<ComponentProps<typeof WithTooltip>, "children">;

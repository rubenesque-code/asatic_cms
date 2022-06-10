// import "react-popper-tooltip/dist/styles.css";
import { cloneElement, Fragment, ReactElement } from "react";
import { usePopperTooltip, Config } from "react-popper-tooltip";
// import { Transition } from "@headlessui/react";
import tw from "twin.macro";

// "tailwindcss": "^3.0.24",
const WithTooltip = ({
  children,
  placement = "auto",
  text,
  isDisabled = false,
  yOffset = 10,
  type = "info",
}: {
  yOffset?: number;
  children: ReactElement;
  placement?: Config["placement"];
  text: string | ReactElement;
  isDisabled?: boolean;
  type?: "info" | "action";
}) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({ delayShow: 700, placement, offset: [0, yOffset] });

  const showTooltip = visible && !isDisabled;

  return (
    <>
      {cloneElement(children, {
        ...children.props,
        ref: setTriggerRef,
      })}
      <div
        css={[
          s.tooltip,
          type === "action" &&
            tw`border border-gray-600 bg-[#fafafa] text-gray-700`,
          showTooltip ? s.show : s.hide,
        ]}
        {...getTooltipProps()}
        ref={setTooltipRef}
      >
        {text}
      </div>
    </>
  );
};

export default WithTooltip;

const s = {
  tooltip: tw`text-white bg-gray-700 z-50 text-sm py-0.5 px-2 rounded-sm whitespace-nowrap transition-opacity ease-in-out duration-75 shadow-lg`,
  show: tw`visible opacity-100`,
  hide: tw`invisible opacity-0`,
};

/**
        <Transition
          show={showTooltip}
          as="div"
          enter="transition ease-out duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-75"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          {...getTooltipProps()}
          ref={setTooltipRef}
        >
          <p css={[s.tooltip]}>{text}</p>
        </Transition>
*/

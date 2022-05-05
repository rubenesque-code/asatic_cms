// import "react-popper-tooltip/dist/styles.css";
import { cloneElement, Fragment, ReactElement } from "react";
import { usePopperTooltip, Config } from "react-popper-tooltip";
// import { Transition } from "@headlessui/react";
import tw from "twin.macro";

const WithTooltip = ({
  children,
  placement = "auto",
  text,
  isDisabled = false,
  yOffset = 0,
}: {
  yOffset?: number;
  children: ReactElement;
  placement?: Config["placement"];
  text: string;
  isDisabled?: boolean;
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
      <p
        css={[s.tooltip, showTooltip ? s.show : s.hide]}
        {...getTooltipProps()}
        ref={setTooltipRef}
      >
        {text}
      </p>
    </>
  );
};

export default WithTooltip;

const s = {
  tooltip: tw`text-white bg-gray-700 z-50 text-sm py-0.5 px-2 rounded-sm whitespace-nowrap transition-opacity ease-in-out duration-75`,
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

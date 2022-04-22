import "react-popper-tooltip/dist/styles.css";
import { cloneElement, Fragment, ReactElement } from "react";
import { usePopperTooltip, Config } from "react-popper-tooltip";
import { Transition } from "@headlessui/react";
import tw from "twin.macro";

const WithTooltip = ({
  children,
  placement = "auto",
  text,
  isDisabled = false,
}: {
  children: ReactElement;
  placement?: Config["placement"];
  text: string;
  isDisabled?: boolean;
}) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({ delayShow: 700, placement });

  const showTooltip = visible && !isDisabled;

  return (
    <>
      {cloneElement(children, {
        ...children.props,
        ref: setTriggerRef,
      })}
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
        // {...getTooltipProps({ className: "tooltip-container" })}
        ref={setTooltipRef}
      >
        <p css={[s.tooltip]}>{text}</p>
      </Transition>
    </>
  );
};

export default WithTooltip;

const s = {
  tooltip: tw`text-white bg-gray-700 text-sm py-0.5 px-2 rounded-sm whitespace-nowrap`,
};

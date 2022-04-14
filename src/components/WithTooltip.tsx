import "react-popper-tooltip/dist/styles.css";
import { ReactElement } from "react";
import { usePopperTooltip, Config } from "react-popper-tooltip";

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
    usePopperTooltip({ delayShow: 800, placement });

  return (
    <>
      <children.type {...children.props} ref={setTriggerRef} />
      {/* <Fade in={visible} unmountOnExit> */}
      {visible && !isDisabled ? (
        <p
          {...getTooltipProps({ className: "tooltip-container" })}
          className="text-white bg-gray-700 text-sm py-0.5 px-2 rounded-sm whitespace-nowrap"
          ref={setTooltipRef}
        >
          {text}
        </p>
      ) : null}
      {/* </Fade> */}
    </>
  );
};

export default WithTooltip;

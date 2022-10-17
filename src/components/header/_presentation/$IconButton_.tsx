import { ReactElement } from "react";

import { MyOmit } from "^types/utilities";

import WithTooltip, { Props as TooltipProps } from "^components/WithTooltip";
import { $IconButton, IconButtonProps } from "../_styles";

const $IconButton_ = ({
  children,
  onClick,
  tooltip,
  buttonUI,
}: {
  children: ReactElement;
  onClick?: () => void;
  tooltip: string | MyOmit<TooltipProps, "children">;
  buttonUI?: IconButtonProps;
}) => {
  const tooltipProps: MyOmit<TooltipProps, "children"> =
    typeof tooltip === "string" ? { text: tooltip } : tooltip;

  return (
    <WithTooltip {...tooltipProps}>
      <$IconButton onClick={onClick} {...buttonUI}>
        {children}
      </$IconButton>
    </WithTooltip>
  );
};

export default $IconButton_;

import { ReactElement } from "react";

import { MyOmit } from "^types/utilities";

import WithTooltip, { Props as TooltipProps } from "^components/WithTooltip";
import HeaderUI from "./HeaderUI";

const HeaderIconButton = ({
  children,
  tooltip,
}: {
  children: ReactElement;
  tooltip: string | TooltipProps;
}) => {
  const tooltipProps: MyOmit<TooltipProps, "children"> =
    typeof tooltip === "string" ? { text: tooltip } : tooltip;

  return (
    <WithTooltip {...tooltipProps}>
      <HeaderUI.IconButton>{children}</HeaderUI.IconButton>
    </WithTooltip>
  );
};

export default HeaderIconButton;

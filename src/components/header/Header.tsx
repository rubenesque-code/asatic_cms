import { ReactElement } from "react";
import tw from "twin.macro";

import { MyOmit } from "^types/utilities";

import DeployPopover from "^components/rich-popover/deploy";
import HeaderUI, { UIIconButtonProps } from "./HeaderUI";
import SideBar from "./SideBar";

import WithTooltip, { Props as TooltipProps } from "^components/WithTooltip";
import { DeployIcon } from "^components/Icons";

export default function Header({
  leftElements,
  rightElements,
}: {
  leftElements?: ReactElement;
  rightElements?: ReactElement;
}) {
  return (
    <HeaderUI.Container>
      <div css={[tw`flex items-center gap-md`]}>
        <SideBar />
        {leftElements ? leftElements : null}
      </div>
      <HeaderUI.DefaultButtonSpacing>
        {rightElements ? (
          <>
            {rightElements}
            <HeaderUI.VerticalBar />
          </>
        ) : null}
        <DeployPopover>
          <Header.IconButton tooltip="deploy">
            <DeployIcon />
          </Header.IconButton>
        </DeployPopover>
      </HeaderUI.DefaultButtonSpacing>
    </HeaderUI.Container>
  );
}

Header.IconButton = function IconButton({
  children,
  onClick,
  tooltip,
  buttonUI,
}: {
  children: ReactElement;
  onClick?: () => void;
  tooltip: string | MyOmit<TooltipProps, "children">;
  buttonUI?: UIIconButtonProps;
}) {
  const tooltipProps: MyOmit<TooltipProps, "children"> =
    typeof tooltip === "string" ? { text: tooltip } : tooltip;

  return (
    <WithTooltip {...tooltipProps}>
      <HeaderUI.IconButton onClick={onClick} {...buttonUI}>
        {children}
      </HeaderUI.IconButton>
    </WithTooltip>
  );
};

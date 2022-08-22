import { ReactElement } from "react";
import tw from "twin.macro";

import { MyOmit } from "^types/utilities";

import DeployPopover from "./DeployPopover";
import HeaderUI, { UIIconButtonProps } from "./HeaderUI";
import SideBar from "./SideBar";
import WithTooltip, { Props as TooltipProps } from "^components/WithTooltip";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Header() {}

export function HeaderGeneric({
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
      </div>
      {leftElements ? leftElements : null}
      <HeaderUI.DefaultButtonSpacing>
        {rightElements ? (
          <>
            {rightElements}
            <HeaderUI.VerticalBar />
          </>
        ) : null}
        <DeployPopover />
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
  onClick: () => void;
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

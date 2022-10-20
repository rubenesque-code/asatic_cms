import { ReactElement } from "react";
import tw from "twin.macro";

import DeployPopover from "^components/rich-popover/deploy";
import { SideBar } from "../SideBar";
import { HeaderDeployButton } from "../popover-buttons";
import { $Container, $DefaultButtonSpacing, $VerticalBar } from "../_styles";

export function Header_({
  leftElements,
  rightElements,
}: {
  leftElements?: ReactElement;
  rightElements?: ReactElement;
}) {
  return (
    <$Container>
      <div css={[tw`flex items-center gap-md`]}>
        <SideBar />
        {leftElements ? leftElements : null}
      </div>
      <$DefaultButtonSpacing>
        {rightElements ? (
          <>
            {rightElements}
            <$VerticalBar />
          </>
        ) : null}
        <DeployPopover>
          <HeaderDeployButton />
        </DeployPopover>
      </$DefaultButtonSpacing>
    </$Container>
  );
}

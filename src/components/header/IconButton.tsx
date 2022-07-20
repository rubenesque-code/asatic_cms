import { ReactElement } from "react";

import WithTooltip from "^components/WithTooltip";

import { s_header } from "^styles/header";

const HeaderIconButton = ({
  children,
  tooltipText,
}: {
  children: ReactElement;
  tooltipText: string;
}) => (
  <WithTooltip text={tooltipText}>
    <button css={[s_header.button]}>{children}</button>
  </WithTooltip>
);

export default HeaderIconButton;

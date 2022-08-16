import { ArrowDown } from "phosphor-react";

import { ContentMenuButton } from "^components/menus/Content";

const MoveSectionDownButtonUI = ({
  isDisabled,
  onClick,
}: {
  isDisabled: boolean;
  onClick: () => void;
}) => (
  <ContentMenuButton
    isDisabled={isDisabled}
    onClick={onClick}
    tooltipProps={{ text: "move section down", type: "action" }}
  >
    <ArrowDown />
  </ContentMenuButton>
);

export default MoveSectionDownButtonUI;

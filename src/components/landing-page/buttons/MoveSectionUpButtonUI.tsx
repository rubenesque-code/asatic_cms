import { ArrowUp } from "phosphor-react";

import { ContentMenuButton } from "^components/menus/Content";

const MoveSectionUpButtonUI = ({
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
    <ArrowUp />
  </ContentMenuButton>
);

export default MoveSectionUpButtonUI;

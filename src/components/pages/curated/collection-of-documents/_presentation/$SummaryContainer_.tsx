import { ReactElement } from "react";

import ContainerUtility from "^components/ContainerUtilities";
import { $summaryContainer } from "../_styles/$summary";

export const $SummaryContainer = ({
  children,
}: {
  children: (isHovered: boolean) => ReactElement;
}) => {
  return (
    <ContainerUtility.isHovered styles={$summaryContainer}>
      {(isHovered) => children(isHovered)}
    </ContainerUtility.isHovered>
  );
};

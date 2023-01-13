import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";

export const $summaryContainer = tw`relative px-sm py-sm border h-full`;

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

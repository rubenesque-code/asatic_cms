import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";

export const $Container_ = ({
  children,
}: {
  children: (isHovered: boolean) => ReactElement;
}) => (
  <ContainerUtility.isHovered styles={tw`relative`}>
    {(isHovered) => children(isHovered)}
  </ContainerUtility.isHovered>
);

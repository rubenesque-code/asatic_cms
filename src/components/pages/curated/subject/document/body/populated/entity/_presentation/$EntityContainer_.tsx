import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";

export const $EntityContainer_ = ({
  children,
}: {
  children: (containerIsHovered: boolean) => ReactElement;
}) => (
  <ContainerUtility.isHovered
    styles={tw`relative p-sm col-span-1 min-h-[100px] border`}
  >
    {(containerIsHovered) => children(containerIsHovered)}
  </ContainerUtility.isHovered>
);

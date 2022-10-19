import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";

const $Image_ = ({
  children,
}: {
  children: (isHovered: boolean) => ReactElement;
}) => {
  return (
    <ContainerUtility.isHovered styles={tw`mb-xs`}>
      {(isHovered) => children(isHovered)}
    </ContainerUtility.isHovered>
  );
};

export default $Image_;

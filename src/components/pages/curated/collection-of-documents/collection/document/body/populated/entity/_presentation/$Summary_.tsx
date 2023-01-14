import { ReactElement } from "react";

import ContainerUtility from "^components/ContainerUtilities";

export const $Container_ = ({
  children,
}: {
  children: (isHovered: boolean) => ReactElement;
}) => {
  return (
    <ContainerUtility.isHovered>
      {(isHovered) => children(isHovered)}
    </ContainerUtility.isHovered>
  );
};

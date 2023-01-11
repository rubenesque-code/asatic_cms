import { ReactElement } from "react";

import ContainerUtility from "^components/ContainerUtilities";
import { $card } from "../_styles";

const $CardContainer = ({
  children,
}: {
  children: (isHovered: boolean) => ReactElement;
}) => {
  return (
    <ContainerUtility.isHovered styles={$card}>
      {(isHovered) => children(isHovered)}
    </ContainerUtility.isHovered>
  );
};

export default $CardContainer;

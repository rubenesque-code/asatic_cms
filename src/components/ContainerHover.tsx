import { ReactElement } from "react";
import useHovered from "^hooks/useHovered";

const ContainerHover = ({
  children,
}: {
  children: (isHovered: boolean) => ReactElement | null;
}) => {
  const [isHovered, handlers] = useHovered();

  return <div {...handlers}>{children(isHovered)}</div>;
};

export default ContainerHover;

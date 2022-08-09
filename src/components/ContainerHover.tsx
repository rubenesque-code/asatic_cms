import { ReactElement } from "react";
import tw, { TwStyle } from "twin.macro";
import useHovered from "^hooks/useHovered";

const ContainerHover = ({
  children,
  styles,
}: {
  children: (isHovered: boolean) => ReactElement | null;
  styles?: TwStyle;
}) => {
  const [isHovered, handlers] = useHovered();

  return (
    <div css={[tw`relative`, styles]} {...handlers}>
      {children(isHovered)}
    </div>
  );
};

export default ContainerHover;

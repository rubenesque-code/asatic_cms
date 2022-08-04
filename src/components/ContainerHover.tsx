import { ReactElement } from "react";
import tw from "twin.macro";
import useHovered from "^hooks/useHovered";

const ContainerHover = ({
  children,
}: {
  children: (isHovered: boolean) => ReactElement | null;
}) => {
  const [isHovered, handlers] = useHovered();

  return (
    <div css={[tw`relative`]} {...handlers}>
      {children(isHovered)}
    </div>
  );
};

export default ContainerHover;

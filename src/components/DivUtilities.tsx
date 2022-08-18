import { ReactElement } from "react";
import tw, { TwStyle } from "twin.macro";

import useHovered from "^hooks/useHovered";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function Div() {}

Div.Hover = function DivHover({
  children,
  styles,
}: {
  children: ((isHovered: boolean) => ReactElement) | ReactElement | null;
  styles?: TwStyle;
}) {
  const [isHovered, handlers] = useHovered();

  return (
    <div css={[tw`relative`, styles]} {...handlers}>
      {typeof children === "function" ? children(isHovered) : children}
    </div>
  );
};
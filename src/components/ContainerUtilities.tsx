import { ReactElement } from "react";
import { useMeasure } from "react-use";
import tw, { TwStyle } from "twin.macro";

import useHovered from "^hooks/useHovered";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ContainerUtility() {}

ContainerUtility.Hover = function DivHover({
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

ContainerUtility.Height = function MeasureHeight({
  children,
  styles: style,
}: {
  children: (height: number) => ReactElement | null;
  styles: TwStyle;
}) {
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  return (
    <div ref={ref} style={style}>
      {children(height)}
    </div>
  );
};

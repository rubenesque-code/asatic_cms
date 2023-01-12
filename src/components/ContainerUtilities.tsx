import { ReactElement, useRef } from "react";
import { useMeasure } from "react-use";
import tw, { TwStyle } from "twin.macro";

import { HoverHandlers } from "^types/props";
import useHovered from "^hooks/useHovered";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ContainerUtility() {}

ContainerUtility.isHovered = function DivHover({
  children,
  styles,
}: {
  children: ((isHovered: boolean) => ReactElement) | ReactElement | null;
  styles?: TwStyle;
}) {
  const [isHovered, handlers] = useHovered();

  return (
    <div css={[styles]} {...handlers}>
      {typeof children === "function" ? children(isHovered) : children}
    </div>
  );
};

ContainerUtility.onHover = function OnContainerHover({
  children,
  styles,
  ...hoverHandlers
}: {
  children: ReactElement | null | string;
  styles?: TwStyle;
} & HoverHandlers) {
  return (
    <div css={[tw`relative`, styles]} {...hoverHandlers}>
      {children}
    </div>
  );
};

ContainerUtility.Height = function MeasureHeight({
  children,
  styles: style,
}: {
  children: (height: number) => ReactElement | null;
  styles?: TwStyle;
}) {
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  return (
    <div ref={ref} style={style}>
      {children(height)}
    </div>
  );
};

ContainerUtility.Width = function MeasureWidth({
  children,
  styles: style,
}: {
  children: (width: number) => ReactElement | null;
  styles?: TwStyle;
}) {
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  return (
    <div css={[tw`w-full`]} ref={ref} style={style}>
      {children(width)}
    </div>
  );
};

ContainerUtility.Top = function Top({
  children,
  styles: style,
}: {
  children: (width: number) => ReactElement | null;
  styles?: TwStyle;
}) {
  // const [ref, { width, top, y, height }] = useMeasure<HTMLDivElement>();
  const ref = useRef<HTMLDivElement | null>(null);
  console.log(ref.current?.getBoundingClientRect());

  const width = 123;

  return (
    <div ref={ref} style={style}>
      {children(width)}
    </div>
  );
};

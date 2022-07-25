import { ReactElement } from "react";
import { useMeasure } from "react-use";
import { TwStyle } from "twin.macro";

const MeasureHeight = ({
  children,
  styles: style,
}: {
  children: (height: number) => ReactElement | null;
  styles: TwStyle;
}) => {
  const [ref, { height }] = useMeasure<HTMLDivElement>();

  return (
    <div ref={ref} style={style}>
      {children(height)}
    </div>
  );
};

export default MeasureHeight;

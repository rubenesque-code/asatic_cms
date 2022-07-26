import { ReactElement } from "react";
import { useMeasure } from "react-use";
import { TwStyle } from "twin.macro";

const MeasureWidth = ({
  children,
  styles,
}: {
  children: (width: number) => ReactElement | null;
  styles?: TwStyle;
}) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  return (
    <div css={[styles]} ref={ref}>
      {children(width)}
    </div>
  );
};

export default MeasureWidth;

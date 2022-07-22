import { ReactElement } from "react";
import { useMeasure } from "react-use";

const MeasureWidth = ({
  children,
}: {
  children: (width: number) => ReactElement | null;
}) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  return <div ref={ref}>{children(width)}</div>;
};

export default MeasureWidth;

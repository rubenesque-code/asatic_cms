import { Resizable } from "re-resizable";
import { ReactElement, useEffect } from "react";
import { useMeasure } from "react-use";

export type ResizeImageProps = {
  children: ReactElement;
  aspectRatio?: number;
  onAspectRatioChange: (aspectRatio: number) => void;
};

const ResizeImage = ({
  children,
  aspectRatio = 16 / 9,
  onAspectRatioChange,
}: ResizeImageProps) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  const height = width ? width / aspectRatio : null;

  useEffect(() => {
    if (!width || !height) {
      return;
    }

    const updatedAspectRatio = width / height;
    onAspectRatioChange(updatedAspectRatio);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <div ref={ref}>
      {width && height ? (
        <Resizable
          enable={{ bottom: true }}
          onResizeStop={(_a, _b, _c, d) => {
            const heightChange = d.height;
            const updatedHeight = heightChange + height;
            const updatedAspectRatio = width / updatedHeight;
            onAspectRatioChange(updatedAspectRatio);
          }}
          size={{ width: "100%", height }}
        >
          {children}
        </Resizable>
      ) : null}
    </div>
  );
};

export default ResizeImage;

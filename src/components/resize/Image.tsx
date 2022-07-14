import { Resizable } from "re-resizable";
import { ReactElement, useCallback, useState } from "react";

const ResizeImage = ({
  children,
  aspectRatio,
  onAspectRatioChange,
}: {
  children: ReactElement;
  aspectRatio: number;
  onAspectRatioChange: (aspectRatio: number) => void;
}) => {
  const [width, setWidth] = useState<number | null>(null);

  const refForWidth = useCallback((node: HTMLDivElement) => {
    if (node) {
      const imgWidth = node.offsetWidth;
      setWidth(imgWidth);
    }
  }, []);

  const height = width ? width / aspectRatio : null;

  return (
    <div ref={refForWidth}>
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

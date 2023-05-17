import { Resizable } from "re-resizable";
import { ReactElement } from "react";

const ResizeHeight = ({
  height,
  children,
  onResizeStop,
}: {
  height: number;
  children: ReactElement;
  onResizeStop: (height: number) => void;
}) => {
  return (
    <Resizable
      size={{ width: "100%", height }}
      onResizeStop={(_e, _dir, _ref, d) => {
        const newImageHeightPx = height + d.height;
        onResizeStop(newImageHeightPx);
      }}
      enable={{ bottom: true }}
    >
      {children}
    </Resizable>
  );
};

export default ResizeHeight;

import React, { useState, useEffect } from "react";
import { withResizeDetector } from "react-resize-detector";

const containerStyles = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const AdaptiveComponent = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const [color, setColor] = useState("red");

  useEffect(() => {
    setColor(width > 500 ? "coral" : "aqua");
  }, [width]);

  return (
    <div
      style={{ backgroundColor: color, ...containerStyles }}
    >{`${width}x${height}`}</div>
  );
};

const AdaptiveWithDetector = withResizeDetector(AdaptiveComponent);

const App = () => {
  return (
    <div>
      <p>The rectangle changes color based on its width</p>
      <AdaptiveWithDetector />
    </div>
  );
};

export default App;

import { ReactElement } from "react";

import { StickyProvider } from "^context/StickyContext";

import {
  Canvas as Canvas_,
  CanvasContainer,
} from "^components/display-content/entity-page/Canvas";

export default function Canvas({ children }: { children: ReactElement }) {
  return (
    <CanvasContainer>
      <StickyProvider>
        <Canvas_>{children}</Canvas_>
      </StickyProvider>
    </CanvasContainer>
  );
}

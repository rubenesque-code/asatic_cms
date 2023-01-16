import { ReactElement } from "react";

import { StickyProvider, useStickyContext } from "^context/StickyContext";

import {
  $CanvasWithForwardRef_,
  $CanvasContainer_,
} from "^curated-pages/_presentation/$Canvas_";

export default function StickyCanvas_({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <$CanvasContainer_>
      <StickyProvider>
        <Canvas_>{children}</Canvas_>
      </StickyProvider>
    </$CanvasContainer_>
  );
}

const Canvas_ = ({ children }: { children: ReactElement }) => {
  const { scrollContainerRef } = useStickyContext();

  return (
    <$CanvasWithForwardRef_ ref={scrollContainerRef}>
      {children}
    </$CanvasWithForwardRef_>
  );
};

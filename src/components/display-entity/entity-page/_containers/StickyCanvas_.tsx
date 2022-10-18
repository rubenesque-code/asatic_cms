import { ReactElement } from "react";

import { StickyProvider, useStickyContext } from "^context/StickyContext";

import {
  $CanvasWithForwardRef_,
  $CanvasContainer_,
} from "^components/display-entity/entity-page/_presentation/$Canvas_";

export default function StickyCanvas_({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <$CanvasContainer_>
      <StickyProvider>
        <Canvas__>{children}</Canvas__>
      </StickyProvider>
    </$CanvasContainer_>
  );
}

const Canvas__ = ({ children }: { children: ReactElement }) => {
  const { scrollContainerRef } = useStickyContext();

  return (
    <$CanvasWithForwardRef_ ref={scrollContainerRef}>
      {children}
    </$CanvasWithForwardRef_>
  );
};

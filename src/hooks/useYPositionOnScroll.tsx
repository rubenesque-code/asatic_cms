import { MutableRefObject, useEffect, useState } from "react";
import { useWindowScroll } from "react-use";

const useYPositionOnScroll = (ref: MutableRefObject<HTMLDivElement | null>) => {
  const [yPos, setYPos] = useState<number | null>(null);

  const windowScroll = useWindowScroll();

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const yPos = node.getBoundingClientRect().y;

    setYPos(yPos);
  }, [windowScroll, ref]);

  return yPos;
};

export default useYPositionOnScroll;

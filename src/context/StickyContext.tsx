import {
  createContext,
  MutableRefObject,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { checkObjectHasField } from "^helpers/general";
import useForceUpdate from "^hooks/useForceUpdate";

type ContextValue = {
  trackedElementRef: MutableRefObject<HTMLDivElement | null>;
  containerTop: number | null;
  trackedTop: number | null;
  scrollContainerRef: (node: HTMLDivElement) => void;
};
const Context = createContext<ContextValue>({} as ContextValue);

const StickyProvider = ({ children }: { children: ReactElement }) => {
  const [containerTop, setContainerTop] = useState<number | null>(null);
  const [trackedTop, setTrackedTop] = useState<number | null>(null);

  const forceUpdate = useForceUpdate();

  const scrollNumRef = useRef(0);
  const scrollNum = scrollNumRef.current;
  const prevScrollNumRef = useRef(0);
  const prevScrollNum = prevScrollNumRef.current;

  const scrollContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }
    setContainerTop(node.getBoundingClientRect().top);

    const handleScroll = () => {
      scrollNumRef.current++;
      forceUpdate();
    };
    node.addEventListener("scroll", handleScroll);

    () => node.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trackedElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wasScrolled = prevScrollNum !== scrollNum;
    if (wasScrolled && trackedElementRef.current) {
      const editorTop = trackedElementRef.current.getBoundingClientRect().top;
      setTrackedTop(editorTop);

      prevScrollNumRef.current++;
    }
  }, [prevScrollNum, scrollNum]);

  return (
    <Context.Provider
      value={{
        containerTop,
        trackedElementRef,
        trackedTop,
        scrollContainerRef,
      }}
    >
      {children}
    </Context.Provider>
  );
};

function useStickyContext(stickOffset = 0) {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useStickyContext must be used within its provider!");
  }
  const {
    containerTop: stickPoint,
    trackedTop,
    trackedElementRef,
    scrollContainerRef,
  } = context;

  const trackedWithOffsetPoint =
    typeof trackedTop === "number" && trackedTop + stickOffset;

  const stickyRefsReady =
    typeof stickPoint === "number" &&
    typeof trackedWithOffsetPoint === "number";

  const isSticky = stickyRefsReady && trackedWithOffsetPoint <= stickPoint;

  return { trackedElementRef, isSticky, stickPoint, scrollContainerRef };
}

export { StickyProvider, useStickyContext };

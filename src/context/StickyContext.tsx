import {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { checkObjectHasField } from "^helpers/general";
import useForceUpdate from "^hooks/useForceUpdate";

// * scroll needs to be tracked from the container with scrollbar; not done through a child container in which e.g. scroll wheel goes up and down.
// * in this case, container being scrolled and the container whose top position is needed are the same.

type ContextValue = {
  scrollContainerTop: number | null;
  scrollContainerRef: (node: HTMLDivElement) => void;
  scrollNum: number;
  prevScrollNum: number;
  updatePrevScrollNum: () => void;
};
const Context = createContext<ContextValue>({} as ContextValue);

const StickyProvider = ({ children }: { children: ReactElement }) => {
  const [scrollContainerTop, setScrollContainerTop] = useState<number | null>(
    null
  );

  const scrollNumRef = useRef(0);
  const scrollNum = scrollNumRef.current;
  const prevScrollNumRef = useRef(0);
  const prevScrollNum = prevScrollNumRef.current;

  const forceUpdate = useForceUpdate();

  const scrollContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }
    setScrollContainerTop(node.getBoundingClientRect().top);

    const handleScroll = () => {
      scrollNumRef.current++;
      forceUpdate();
    };
    node.addEventListener("scroll", handleScroll);

    () => node.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Context.Provider
      value={{
        scrollContainerTop,
        scrollContainerRef,
        prevScrollNum,
        scrollNum,
        updatePrevScrollNum: () => prevScrollNumRef.current++,
      }}
    >
      {children}
    </Context.Provider>
  );
};

function useStickyContext(
  props: {
    onScroll?: ({
      scrollContainerTop,
    }: {
      scrollContainerTop: number | null;
    }) => void;
  } | void
) {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useStickyContext must be used within its provider!");
  }

  const {
    prevScrollNum,
    scrollNum,
    updatePrevScrollNum,
    scrollContainerRef,
    scrollContainerTop,
  } = context;

  useEffect(() => {
    if (!props?.onScroll) {
      return;
    }
    const wasScrolled = prevScrollNum !== scrollNum;
    if (wasScrolled) {
      props.onScroll({ scrollContainerTop });
      updatePrevScrollNum();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevScrollNum, scrollNum]);

  return { scrollContainerRef, scrollContainerTop };
}

export { StickyProvider, useStickyContext };

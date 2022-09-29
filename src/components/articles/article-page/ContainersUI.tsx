import { ReactElement, useCallback, useRef, useState } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import { ScrollContextProvider } from "^context/ScrollContext";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ContainersUI() {}

ContainersUI.ScreenHeight = tw.div`h-screen overflow-hidden flex flex-col `;

ContainersUI.Canvas = function ContentCanvas({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <ContainerUtility.Height
      styles={tw`h-full grid place-items-center bg-gray-50 border-t-2 border-gray-200`}
    >
      {(containerHeight) =>
        containerHeight ? (
          <Canvas containerHeight={containerHeight}>{children}</Canvas>
        ) : null
      }
    </ContainerUtility.Height>
  );
};

const useForceUpdate = () => {
  const [, setState] = useState({});
  return () => setState({});
};

const Canvas = ({
  children,
  containerHeight,
}: {
  children: ReactElement;
  containerHeight: number;
}) => {
  const [top, setTop] = useState<number | null>(null);

  const scrollNumRef = useRef(0);
  const forceUpdate = useForceUpdate();

  const prevScrollNumRef = useRef(0);

  const canvasRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) {
      return;
    }
    setTop(node.getBoundingClientRect().top);

    const handleScroll = () => {
      scrollNumRef.current++;
      forceUpdate();
    };
    node.addEventListener("scroll", handleScroll);

    () => node.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main
      css={[
        tw`w-[95%] max-w-[720px] pl-lg pr-xl overflow-y-auto overflow-x-hidden bg-white shadow-md`,
      ]}
      style={{ height: containerHeight * 0.95 }}
      ref={canvasRef}
    >
      {top ? (
        <ScrollContextProvider
          prevScrollNum={prevScrollNumRef.current}
          scrollNum={scrollNumRef.current}
          top={top}
          updatePrevScrollNum={() => prevScrollNumRef.current++}
        >
          {children}
        </ScrollContextProvider>
      ) : null}
    </main>
  );
};

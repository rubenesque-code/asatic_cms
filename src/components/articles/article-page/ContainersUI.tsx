import { ReactElement, useCallback, useRef, useState } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";
import { ScrollContextProvider } from "^context/ScrollContext";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ContainersUI() {}

ContainersUI.ScreenHeight = tw.div`h-screen overflow-hidden flex flex-col `;

const useForceUpdate = () => {
  const [, setState] = useState({});
  return () => setState({});
};

ContainersUI.Canvas = function ContentCanvas({
  children,
}: {
  children: ReactElement;
}) {
  const [top, setTop] = useState<number | null>(null);

  const scrollNumRef = useRef(0);
  const forceUpdate = useForceUpdate();

  const prevScrollNum = useRef(0);

  const ref = useCallback((node: HTMLDivElement) => {
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
    <ContainerUtility.Height
      styles={tw`h-full grid place-items-center bg-gray-50 border-t-2 border-gray-200`}
    >
      {(containerHeight) =>
        containerHeight ? (
          <main
            css={[
              tw`w-[95%] max-w-[720px] pl-lg pr-xl overflow-y-auto overflow-x-hidden bg-white shadow-md`,
            ]}
            style={{ height: containerHeight * 0.95 }}
            ref={ref}
          >
            {top ? (
              <ScrollContextProvider
                prevScrollNum={prevScrollNum.current}
                scrollNum={scrollNumRef.current}
                top={top}
                updatePrevScrollNum={() => prevScrollNum.current++}
              >
                {children}
              </ScrollContextProvider>
            ) : null}
          </main>
        ) : null
      }
    </ContainerUtility.Height>
  );
};

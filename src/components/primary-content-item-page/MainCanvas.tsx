import { ReactElement } from "react";
import tw from "twin.macro";

import MeasureHeight from "^components/MeasureHeight";

const MainCanvas = ({ children }: { children: ReactElement }) => {
  return (
    <MeasureHeight
      styles={tw`h-full grid place-items-center bg-gray-50 border-t-2 border-gray-200`}
    >
      {(containerHeight) =>
        containerHeight ? (
          <main
            css={[
              tw`w-[95%] max-w-[720px] pl-lg pr-xl overflow-y-auto overflow-x-hidden bg-white shadow-md`,
            ]}
            style={{ height: containerHeight * 0.95 }}
          >
            {children}
          </main>
        ) : null
      }
    </MeasureHeight>
  );
};

export default MainCanvas;

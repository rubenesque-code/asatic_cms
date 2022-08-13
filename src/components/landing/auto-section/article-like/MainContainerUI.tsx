import { ReactElement } from "react";
import tw from "twin.macro";

import MeasureHeight from "^components/MeasureHeight";

const MainContainerUI = ({ children }: { children: ReactElement }) => (
  <MeasureHeight
    styles={tw`h-full grid place-items-center bg-gray-50 border-t-2 border-gray-200`}
  >
    {(height) =>
      height ? (
        <div
          css={[tw`w-[95%] max-w-[1200px] overflow-y-auto bg-white shadow-md`]}
          style={{ height: height * 0.95 }}
        >
          <main css={[tw`pt-xl pb-lg`]}>{children}</main>
        </div>
      ) : null
    }
  </MeasureHeight>
);

export default MainContainerUI;

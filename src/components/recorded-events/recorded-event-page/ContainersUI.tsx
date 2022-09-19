import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";

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
    </ContainerUtility.Height>
  );
};

import { ReactElement } from "react";
import tw from "twin.macro";

import ContainerUtility from "^components/ContainerUtilities";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ContainersUI() {}

ContainersUI.Page = tw.div`min-h-screen flex flex-col`;

ContainersUI.Canvas = function Canvas({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <ContainerUtility.Height
      styles={tw`flex-grow grid place-items-center bg-gray-50 border-t-2 border-gray-200`}
    >
      {(containerHeight) =>
        containerHeight ? (
          <main
            css={[
              tw`w-[95%] max-w-[1200px] pl-lg pr-xl overflow-y-auto bg-white shadow-md`,
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

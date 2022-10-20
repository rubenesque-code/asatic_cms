import { ReactElement } from "react";
import tw from "twin.macro";
import ContainerUtility from "^components/ContainerUtilities";

export function $PopulatedContainer_({
  children,
}: {
  children: (width: number) => ReactElement;
}) {
  return (
    <ContainerUtility.Width
      styles={tw`flex flex-col items-center border-t border-b`}
    >
      {(width) => (
        <div
          css={[
            tw`w-full grid grid-cols-4 grid-auto-rows["max-content"] max-w-[95%] bg-gray-100`,
          ]}
        >
          {children(width)}
        </div>
      )}
    </ContainerUtility.Width>
  );
}

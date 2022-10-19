import { ReactElement } from "react";
import tw from "twin.macro";

export function $PopulatedContainer_({ children }: { children: ReactElement }) {
  return (
    <div css={[tw`flex flex-col items-center border-t border-b`]}>
      <div
        css={[
          tw`w-full grid grid-cols-4 grid-auto-rows["max-content"] max-w-[95%]`,
        ]}
      >
        {children}
      </div>
    </div>
  );
}

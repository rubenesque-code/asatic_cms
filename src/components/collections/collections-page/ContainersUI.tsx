import { ReactElement } from "react";
import tw from "twin.macro";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export default function ContainersUI() {}

ContainersUI.Page = tw.div`min-h-screen flex flex-col`;

ContainersUI.Body = function Body({ children }: { children: ReactElement }) {
  return (
    <div css={[tw`flex justify-center`]}>
      <div css={[tw`max-w-[1600px] w-full`]}>{children}</div>
    </div>
  );
};

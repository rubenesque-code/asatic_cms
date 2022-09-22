import { ReactElement } from "react";
import tw from "twin.macro";

export default function CustomSectionUI({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <div css={[tw`flex flex-col items-center border-t border-b`]}>
      <div css={[tw`grid grid-cols-4 max-w-[95%]`]}>{children}</div>
    </div>
  );
}

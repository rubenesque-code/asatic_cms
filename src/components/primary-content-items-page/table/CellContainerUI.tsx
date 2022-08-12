import { ReactElement } from "react";
import tw from "twin.macro";

const CellContainerUI = ({ children }: { children: ReactElement | string }) => (
  <div css={[s]}>{children}</div>
);

export default CellContainerUI;

const s = tw`py-2 text-gray-600 flex items-center justify-center border whitespace-nowrap px-sm`;

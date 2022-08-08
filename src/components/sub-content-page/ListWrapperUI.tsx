import { ReactElement } from "react";
import tw from "twin.macro";

const ListWrapperUI = ({ children }: { children: ReactElement[] }) => (
  <div css={[tw`flex items-center gap-md`]}>{children}</div>
);

export default ListWrapperUI;

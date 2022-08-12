import { ReactElement } from "react";
import tw from "twin.macro";

const PageWrapperUI = ({ children }: { children: ReactElement }) => (
  <div css={[tw`min-h-screen flex flex-col`]}>{children}</div>
);

export default PageWrapperUI;

import { ReactElement } from "react";
import tw from "twin.macro";

const AuthorsStylingUI = ({ children }: { children: ReactElement }) => (
  <div css={[tw`text-lg`]}>{children}</div>
);

export default AuthorsStylingUI;

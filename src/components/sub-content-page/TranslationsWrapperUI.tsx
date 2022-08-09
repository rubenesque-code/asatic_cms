import { ReactElement } from "react";
import tw from "twin.macro";

const TranslationsWrapperUI = ({ children }: { children: ReactElement[] }) => (
  <div css={[tw`flex items-center gap-sm`]}>{children}</div>
);

export default TranslationsWrapperUI;

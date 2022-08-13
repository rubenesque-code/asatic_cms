import { ReactElement } from "react";
import tw from "twin.macro";

const AutoSectionArticleLikeAuthorsStylingUI = ({
  children,
}: {
  children: ReactElement;
}) => <div css={[tw`text-lg`]}>{children}</div>;

export default AutoSectionArticleLikeAuthorsStylingUI;

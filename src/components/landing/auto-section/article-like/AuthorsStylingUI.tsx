import { ReactElement } from "react";
import tw from "twin.macro";

const AutoSectionArticleLikeAuthorsStylingUI = ({
  children,
}: {
  children: ReactElement;
}) => <div css={[tw`text-2xl text-articleText`]}>{children}</div>;

export default AutoSectionArticleLikeAuthorsStylingUI;

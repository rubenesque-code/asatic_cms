import tw from "twin.macro";

import { $Title } from "../../_styles/$summary";

export const Title_ = ({ title }: { title: string | undefined }) => (
  <$Title>
    <span css={[!title && tw`text-gray-placeholder`]}>
      {title?.length ? title : "Title"}
    </span>
  </$Title>
);

import tw from "twin.macro";
import { $ArticleLikeTitle } from "../_styles";

const $ArticleLikeTitle_ = ({ title }: { title: string | undefined }) => {
  return (
    <$ArticleLikeTitle css={[!title?.length && tw`text-gray-placeholder`]}>
      {title ? title : "Title"}
    </$ArticleLikeTitle>
  );
};

export default $ArticleLikeTitle_;

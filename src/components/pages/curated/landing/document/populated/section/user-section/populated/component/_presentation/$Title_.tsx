import tw from "twin.macro";
import { $Title } from "../_styles";

const $Title_ = ({ title }: { title: string | undefined }) => {
  return (
    <$Title css={[!title?.length && tw`text-gray-placeholder`]}>
      {title ? title : "Title"}
    </$Title>
  );
};

export default $Title_;

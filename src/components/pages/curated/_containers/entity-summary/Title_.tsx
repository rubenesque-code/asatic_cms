import tw from "twin.macro";

export const Title_ = ({ title }: { title: string | undefined }) => (
  <span css={[!title && tw`text-gray-placeholder`]}>
    {title?.length ? title : "Title"}
  </span>
);

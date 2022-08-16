import { ReactElement } from "react";
import tw from "twin.macro";

const AutoSectionArticleLikeUI = ({
  publishDate,
  short,
  title,
  authors,
  image,
}: {
  title: ReactElement;
  authors?: ReactElement;
  image?: ReactElement | null;
  publishDate?: ReactElement;
  short: ReactElement;
}) => {
  return (
    <div css={[tw`relative p-sm h-full`]}>
      {image ? <div css={[tw`w-full aspect-ratio[16/9]`]}>{image}</div> : null}
      <div css={[image && tw`mt-sm`]}>{title}</div>
      {authors ? <div css={[tw`mt-xxxs`]}>{authors}</div> : null}
      {publishDate ? <div css={[tw`mt-xs`]}>{publishDate}</div> : null}
      <div css={[tw`mt-xs`]}>{short}</div>
    </div>
  );
};

export default AutoSectionArticleLikeUI;

import tw from "twin.macro";
import { formatArticleDate } from "^helpers/general";

export const Date_ = ({ publishDate }: { publishDate: Date | undefined }) => {
  if (!publishDate) {
    return null;
  }

  return (
    <div css={[tw`uppercase tracking-wider text-sm mt-xs text-gray-700`]}>
      {formatArticleDate(publishDate)}
    </div>
  );
};

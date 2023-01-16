import tw from "twin.macro";
import { formatDateDMYStr } from "^helpers/general";

export const Date_ = ({
  publishDate,
  languageId,
}: {
  publishDate: Date | undefined;
  languageId: string;
}) => {
  if (!publishDate) {
    return null;
  }

  const dateStr =
    languageId === "english"
      ? formatDateDMYStr(publishDate, "en")
      : languageId === "tamil"
      ? formatDateDMYStr(publishDate, "ta")
      : formatDateDMYStr(publishDate);

  return (
    <div css={[tw`uppercase tracking-wider text-sm mt-xs text-gray-700`]}>
      {/* {formatArticleDate(publishDate)} */}
      {dateStr}
    </div>
  );
};

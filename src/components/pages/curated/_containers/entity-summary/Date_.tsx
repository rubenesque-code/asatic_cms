import { formatArticleDate } from "^helpers/general";

export const Date_ = ({ publishDate }: { publishDate: Date | undefined }) => {
  if (!publishDate) {
    return null;
  }

  return <>{formatArticleDate(publishDate)}</>;
};

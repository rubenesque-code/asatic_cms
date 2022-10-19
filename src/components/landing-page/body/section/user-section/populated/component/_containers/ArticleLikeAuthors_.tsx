import DocAuthorsText from "^components/authors/DocAuthorsText";

import { $ArticleLikeAuthors } from "../_styles";

const ArticleLikeAuthors_ = ({
  authorsIds,
  activeLanguageId,
}: {
  authorsIds: string[];
  activeLanguageId: string;
}) => {
  if (!authorsIds.length) {
    return null;
  }

  return (
    <$ArticleLikeAuthors>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
    </$ArticleLikeAuthors>
  );
};

export default ArticleLikeAuthors_;

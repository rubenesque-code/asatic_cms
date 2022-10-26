import DocAuthorsText from "^components/authors/DocAuthorsText";

import { $Authors } from "../_styles";

const Authors_ = ({
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
    <$Authors>
      <DocAuthorsText
        authorIds={authorsIds}
        docActiveLanguageId={activeLanguageId}
      />
    </$Authors>
  );
};

export default Authors_;

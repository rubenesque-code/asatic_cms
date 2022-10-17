import { useSelector } from "^redux/hooks";
import { selectAuthorById } from "^redux/state/authors";

import AuthorSlice from "^context/authors/AuthorContext";

import { $MissingEntity } from "^components/rich-popover/_presentation/RelatedEntities";
import Found from "./Found";

const Author = ({ id }: { id: string }) => {
  const author = useSelector((state) => selectAuthorById(state, id));

  return author ? (
    <AuthorSlice.Provider author={author}>
      <Found />
    </AuthorSlice.Provider>
  ) : (
    <$MissingEntity entityType="author" />
  );
};

export default Author;

import { useSelector } from "^redux/hooks";
import { selectAuthorById } from "^redux/state/authors";

import AuthorSlice from "^context/authors/AuthorContext";
import { useComponentContext } from "../../../Context";

import {
  $MissingEntity,
  $Entity,
} from "^components/rich-popover/_presentation/RelatedEntities";
import Found from "./Found";

const Author = ({ id: authorId }: { id: string }) => {
  const author = useSelector((state) => selectAuthorById(state, authorId));

  const { parentEntityData, removeAuthorRelations } = useComponentContext();

  return (
    <$Entity
      entity={{
        element: author ? (
          <AuthorSlice.Provider author={author}>
            <Found />
          </AuthorSlice.Provider>
        ) : (
          <$MissingEntity entityType="author" />
        ),
        name: "subject",
      }}
      parentEntity={{
        name: parentEntityData.name,
        removeFrom: () => removeAuthorRelations(authorId),
      }}
    />
  );
};

export default Author;

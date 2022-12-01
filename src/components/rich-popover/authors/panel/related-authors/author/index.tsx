import { useSelector } from "^redux/hooks";
import { selectAuthorById } from "^redux/state/authors";

import AuthorSlice from "^context/authors/AuthorContext";
import { useComponentContext } from "../../../Context";

import {
  $MissingEntity,
  $RelatedEntity_,
  $RelatedEntityMenu_,
} from "^components/rich-popover/_presentation";
import Found from "./Found";
import { ROUTES } from "^constants/routes";

const RelatedEntity = ({ id: authorId }: { id: string }) => {
  return (
    <$RelatedEntity_
      entity={<Author id={authorId} />}
      menu={<Menu id={authorId} />}
    />
  );
};

export default RelatedEntity;

const Author = ({ id: authorId }: { id: string }) => {
  const author = useSelector((state) => selectAuthorById(state, authorId));

  return author ? (
    <AuthorSlice.Provider author={author}>
      <Found />
    </AuthorSlice.Provider>
  ) : (
    <$MissingEntity entityType="author" />
  );
};

const Menu = ({ id: authorId }: { id: string }) => {
  const author = useSelector((state) => selectAuthorById(state, authorId));

  const { removeAuthorRelations } = useComponentContext();

  return (
    <$RelatedEntityMenu_
      relatedEntity={{
        remove: () => removeAuthorRelations(authorId),
        href: author ? `${ROUTES.AUTHORS.route}/${authorId}` : undefined,
      }}
    />
  );
};

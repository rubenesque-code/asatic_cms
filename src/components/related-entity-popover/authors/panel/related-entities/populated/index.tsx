import { useSelector } from "^redux/hooks";
import { selectAuthorsByIds } from "^redux/state/authors";

import AuthorSlice from "^context/authors/AuthorContext";

import { $Container } from "^components/related-entity-popover/_styles/relatedEntities";
import { useComponentContext } from "../../../Context";
import Found from "./Found";
import Missing from "./Missing";

const Populated = () => {
  const [{ parentAuthorsIds }] = useComponentContext();

  const parentAuthors = useSelector((state) =>
    selectAuthorsByIds(state, parentAuthorsIds)
  );

  return (
    <$Container>
      {parentAuthors.map((author, i) =>
        author ? (
          <AuthorSlice.Provider author={author}>
            <Found key={author.id} />
          </AuthorSlice.Provider>
        ) : (
          <Missing key={i} />
        )
      )}
    </$Container>
  );
};

export default Populated;

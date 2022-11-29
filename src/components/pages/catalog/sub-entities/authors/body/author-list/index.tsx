import tw from "twin.macro";
import { useSelector } from "^redux/hooks";
import { selectAuthors } from "^redux/state/authors";
import Author from "./author";

// author for each translation. add, delete, update translation. Delete author.
// - should allow delete of translation if used?
// - how to represent related document given translations
// show documents attached to author.

const AuthorList = () => {
  const allAuthors = useSelector(selectAuthors);

  return (
    <div css={[tw`flex flex-col gap-md ml-lg`]}>
      {allAuthors.map((author) => (
        <Author author={author} key={author.id} />
      ))}
    </div>
  );
};

export default AuthorList;

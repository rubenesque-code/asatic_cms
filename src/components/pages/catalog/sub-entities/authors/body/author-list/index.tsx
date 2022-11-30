import tw from "twin.macro";
import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect, {
  allLanguageId,
} from "^components/FilterLanguageSelect";
import { useSelector } from "^redux/hooks";
import { selectAuthorsByLanguageAndQuery } from "^redux/state/complex-selectors/author";
import Author from "./author";

const AuthorList = () => {
  const { id: languageId } = FilterLanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const filtered = useSelector((state) =>
    selectAuthorsByLanguageAndQuery(state, { languageId, query })
  );

  return (
    <div css={[tw`ml-xl`]}>
      {!filtered.length ? (
        <p css={[tw`text-gray-600 italic`]}>
          {!isFilter ? "- No authors yet -" : "- No authors for filter(s) -"}
        </p>
      ) : (
        <div css={[tw`flex flex-col gap-md`]}>
          {filtered.map((author) => (
            <Author author={author} key={author.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorList;

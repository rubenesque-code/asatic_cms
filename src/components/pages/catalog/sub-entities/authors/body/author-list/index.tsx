import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect, {
  allLanguageId,
} from "^components/FilterLanguageSelect";
import { useSelector } from "^redux/hooks";
import { selectAuthorsByLanguageAndQuery } from "^redux/state/complex-selectors/author";
import Author from "./author";
import { $EntitiesList_ } from "^catalog-pages/_presentation/$EntitiesList";

const AuthorList = () => {
  const { id: languageId } = FilterLanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const filtered = useSelector((state) =>
    selectAuthorsByLanguageAndQuery(state, { languageId, query })
  );

  return (
    <$EntitiesList_ entityName="author" isFilter={isFilter}>
      {filtered.map((author) => (
        <Author author={author} key={author.id} />
      ))}
    </$EntitiesList_>
  );
};

export default AuthorList;

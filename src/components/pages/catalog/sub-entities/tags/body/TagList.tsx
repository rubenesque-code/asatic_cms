import DocsQuery from "^components/DocsQuery";
import { useSelector } from "^redux/hooks";
// import Author from "./author";
import { $EntitiesList_ } from "^catalog-pages/_presentation/$EntitiesList";
import { selectTagsByQuery } from "^redux/state/complex-selectors/tag";
import Tag from "./tag";

const TagList = () => {
  const query = DocsQuery.useContext();

  const isFilter = Boolean(query.length);

  const filtered = useSelector((state) => selectTagsByQuery(state, { query }));

  return (
    <$EntitiesList_ entityName="tag" isFilter={isFilter}>
      {filtered.map((tag) => (
        <Tag tag={tag} key={tag.id} />
      ))}
    </$EntitiesList_>
  );
};

export default TagList;

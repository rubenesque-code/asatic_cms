import { $BodySkeleton_ } from "^catalog-pages/_presentation/$BodySkeleton_";

import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect from "^components/FilterLanguageSelect";
import { $Filters_ } from "^catalog-pages/_presentation";
import CreateAuthorForm from "./CreateAuthorForm";
import AuthorList from "./author-list";

const Body = () => {
  return (
    <$BodySkeleton_ createEntity={<CreateAuthorForm />} title="Authors">
      <FiltersAndAuthorList />
    </$BodySkeleton_>
  );
};

export default Body;

const FiltersAndAuthorList = () => {
  return (
    <DocsQuery.Provider>
      <FilterLanguageSelect.Provider>
        <>
          <$Filters_>
            <FilterLanguageSelect.Select />
            <DocsQuery.InputCard />
          </$Filters_>
          <AuthorList />
        </>
      </FilterLanguageSelect.Provider>
    </DocsQuery.Provider>
  );
};

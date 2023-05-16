import { ReactElement } from "react";

import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect from "^components/FilterLanguageSelect";

import FiltersUI from "^components/FiltersUI";
import { $FiltersAndTableContainer, $TableContainer } from "../../_styles";
import Table from "./table";

const FiltersAndTable = () => {
  return (
    <$FiltersAndTableContainer>
      <FilterProviders>
        <>
          <FiltersUI marginLeft={false}>
            <>
              <FilterLanguageSelect.Select />
              <DocsQuery.InputCard />
            </>
          </FiltersUI>
          <$TableContainer>
            <Table />
          </$TableContainer>
        </>
      </FilterProviders>
    </$FiltersAndTableContainer>
  );
};

export default FiltersAndTable;

const FilterProviders = ({ children }: { children: ReactElement }) => {
  return (
    <DocsQuery.Provider>
      <FilterLanguageSelect.Provider>{children}</FilterLanguageSelect.Provider>
    </DocsQuery.Provider>
  );
};

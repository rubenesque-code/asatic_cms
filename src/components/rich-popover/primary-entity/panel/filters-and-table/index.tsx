import { ReactElement } from "react";

import DocsQuery from "^components/DocsQuery";
import LanguageSelect from "^components/LanguageSelect";

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
              <LanguageSelect.Select />
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
      <LanguageSelect.Provider>{children}</LanguageSelect.Provider>
    </DocsQuery.Provider>
  );
};

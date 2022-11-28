import { ReactElement } from "react";

import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect from "^components/FilterLanguageSelect";

import { $BodySkeleton_, $Filters_ } from "../_presentation";

export const BodySkeleton_ = ({
  createButton,
  table,
  title,
  isLoadingMutation,
}: {
  createButton: ReactElement;
  title: string;
  table: ReactElement;
  isLoadingMutation: boolean;
}) => {
  return (
    <$BodySkeleton_
      createEntity={createButton}
      title={title}
      isLoadingMutation={isLoadingMutation}
    >
      <DocsQuery.Provider>
        <FilterLanguageSelect.Provider>
          <>
            <$Filters_>
              <FilterLanguageSelect.Select />
              <DocsQuery.InputCard />
            </$Filters_>
            {table}
          </>
        </FilterLanguageSelect.Provider>
      </DocsQuery.Provider>
    </$BodySkeleton_>
  );
};

import { ReactElement } from "react";

import DocsQuery from "^components/DocsQuery";
import LanguageSelect from "^components/LanguageSelect";

import { $BodySkeleton_, $Filters_ } from "../_presentation";

export const BodySkeleton_ = ({
  createButton,
  table,
  title,
}: {
  createButton: ReactElement;
  title: string;
  table: ReactElement;
}) => {
  return (
    <$BodySkeleton_ createButton={createButton} title={title}>
      <DocsQuery.Provider>
        <LanguageSelect.Provider>
          <>
            <$Filters_>
              <LanguageSelect.Select />
              <DocsQuery.InputCard />
            </$Filters_>
            {table}
          </>
        </LanguageSelect.Provider>
      </DocsQuery.Provider>
    </$BodySkeleton_>
  );
};

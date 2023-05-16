import { ReactElement } from "react";

import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect from "^components/FilterLanguageSelect";

import { $BodySkeleton_, $Filters_ } from "../_presentation";

export const BodySkeleton_ = ({
  createEntity,
  entities,
  title,
  isLoadingMutation,
  isTranslatable = true,
  description,
}: {
  createEntity: ReactElement;
  title: string;
  entities: ReactElement;
  isTranslatable?: boolean;
  isLoadingMutation?: boolean;
  description?: string;
}) => {
  return (
    <$BodySkeleton_
      createEntity={createEntity}
      title={title}
      isLoadingMutation={isLoadingMutation}
      description={description}
    >
      <DocsQuery.Provider>
        {isTranslatable ? (
          <FilterLanguageSelect.Provider>
            <>
              <$Filters_>
                <FilterLanguageSelect.Select />
                <DocsQuery.InputCard />
              </$Filters_>
              {entities}
            </>
          </FilterLanguageSelect.Provider>
        ) : (
          <>
            <$Filters_>
              <DocsQuery.InputCard />
            </$Filters_>
            {entities}
          </>
        )}
      </DocsQuery.Provider>
    </$BodySkeleton_>
  );
};

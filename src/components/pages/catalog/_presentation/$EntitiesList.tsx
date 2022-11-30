import { ReactElement } from "react";
import tw from "twin.macro";
import { entityNameToLabel } from "^constants/data";
import { EntityName } from "^types/entity";

const $EntitiesList_ = ({
  children: entities,
  isFilter,
  entityName,
}: {
  children: ReactElement[];
  isFilter: boolean;
  entityName: EntityName;
}) => (
  <div css={[tw`ml-xl`]}>
    {!entities.length ? (
      <p css={[tw`text-gray-600 italic`]}>
        {!isFilter
          ? `- No ${entityNameToLabel(entityName)}s yet -`
          : `- No ${entityNameToLabel(entityName)}s for filter(s) -`}
      </p>
    ) : (
      <div css={[tw`flex flex-col gap-md`]}>{entities}</div>
    )}
  </div>
);

export { $EntitiesList_ };

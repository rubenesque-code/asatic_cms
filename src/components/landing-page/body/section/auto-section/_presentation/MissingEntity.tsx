import tw from "twin.macro";

import { PrimaryEntityType } from "^types/primary-entity";
import { MissingIcon } from "^components/Icons";

// todo: not applicable to auto section
const MissingEntity = ({
  entityType,
}: {
  entityType: PrimaryEntityType | "collection";
}) => {
  return (
    <div css={[tw`min-h-[150px]`]}>
      <div>
        <MissingIcon />
      </div>
      <p>Can&apos;t find {entityType}.</p>
    </div>
  );
};

export default MissingEntity;

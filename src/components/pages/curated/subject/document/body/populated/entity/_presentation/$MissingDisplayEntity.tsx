import tw from "twin.macro";

import { entityNameToLabel } from "^constants/data";

import { EntityNameSubSet } from "^types/entity";

export const $MissingDisplayEntity_ = ({
  entityName,
}: {
  entityName: EntityNameSubSet<
    "article" | "blog" | "collection" | "recordedEvent"
  >;
}) => {
  return (
    <div css={[tw`font-sans text-sm`]}>
      A(n) {entityNameToLabel(entityName)} is connected to this subject but
      can&apos;t be found. Try refreshing the page. It may have been deleted.
    </div>
  );
};

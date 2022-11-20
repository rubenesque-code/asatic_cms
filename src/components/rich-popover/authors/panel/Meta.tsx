import { useComponentContext } from "../Context";

import { $Description, $Heading } from "^components/rich-popover/_styles";
import { $RelatedEntityText_ } from "^components/rich-popover/_presentation";
import { entityNameToLabel } from "^constants/data";

const Meta = () => {
  const { parentEntityData } = useComponentContext();

  return (
    <>
      <$Heading>Authors</$Heading>
      <$Description>
        Edit authors for this {parentEntityData.name}.
      </$Description>
      <$RelatedEntityText_
        popoverEntity={{ label: entityNameToLabel("author") }}
        relatedEntity={{
          isOne: Boolean(parentEntityData.authorsIds.length),
          label: entityNameToLabel(parentEntityData.name),
        }}
      />
    </>
  );
};

export default Meta;

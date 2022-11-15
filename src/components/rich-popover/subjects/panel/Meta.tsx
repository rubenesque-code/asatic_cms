import { useComponentContext } from "../Context";

import { $Description, $Heading } from "^components/rich-popover/_styles";
import { $RelatedEntityText_ } from "^components/rich-popover/_presentation";
import { entityNameToLabel } from "^constants/data";

const Meta = () => {
  const { parentEntityData } = useComponentContext();

  return (
    <>
      <$Heading>Subjects</$Heading>
      <$Description>
        Subjects are broad: e.g. biology, art, politics. They are displayed on
        the website menus.
      </$Description>
      <$RelatedEntityText_
        popoverEntity={{ label: entityNameToLabel("subject") }}
        relatedEntity={{
          isOne: Boolean(parentEntityData.subjectIds.length),
          label: entityNameToLabel(parentEntityData.name),
        }}
      />
    </>
  );
};

export default Meta;

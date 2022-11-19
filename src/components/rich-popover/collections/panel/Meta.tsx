import { useComponentContext } from "../Context";

import { $Description, $Heading } from "^components/rich-popover/_styles";
import { $RelatedEntityText_ } from "^components/rich-popover/_presentation";
import { entityNameToLabel } from "^constants/data";

const Meta = () => {
  const { parentEntityData } = useComponentContext();

  return (
    <>
      <$Heading>Collections</$Heading>
      <$Description>
        Collections are used to group content in a narrower way than a subject,
        or any way you see fit. E.g. &quot;Environment&quot; (collection) vs
        &apos;Politics&apos; (subject). They can be displayed on the landing
        page.
      </$Description>
      <$RelatedEntityText_
        popoverEntity={{ label: entityNameToLabel("collection") }}
        relatedEntity={{
          isOne: Boolean(parentEntityData.collectionsIds.length),
          label: entityNameToLabel(parentEntityData.name),
        }}
      />
    </>
  );
};

export default Meta;

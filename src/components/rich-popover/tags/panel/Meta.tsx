import { useComponentContext } from "../Context";

import { $Description, $Heading } from "^components/rich-popover/_styles";
import { $RelatedEntityText_ } from "^components/rich-popover/_presentation";
import { entityNameToLabel } from "^constants/data";

const Meta = () => {
  const { parentEntityData } = useComponentContext();

  return (
    <>
      <$Heading>Tags</$Heading>
      <$Description>
        Tags allow all documents, such as articles and videos, to be narrowly
        categorised on the website, mainly for search purposes. They can be
        broad, e.g. politics, or narrow, e.g. oil. Documents can have many tags.
      </$Description>
      <$RelatedEntityText_
        popoverEntity={{ label: "tag" }}
        relatedEntity={{
          isOne: Boolean(parentEntityData.tagsIds.length),
          label: entityNameToLabel(parentEntityData.name),
        }}
      />
    </>
  );
};

export default Meta;

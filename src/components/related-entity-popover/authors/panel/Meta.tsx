import { useComponentContext } from "../Context";

import {
  $Description,
  $Heading,
  $NoRelatedEntityText,
  $RelatedEntityText,
} from "^components/related-entity-popover/_styles";

const Meta = () => {
  const [{ parentType, parentAuthorsIds }] = useComponentContext();

  return (
    <>
      <$Heading>Authors</$Heading>
      <$Description>Edit authors for this {parentType}</$Description>
      {!parentAuthorsIds.length ? (
        <$NoRelatedEntityText>
          This {parentType} has no authors related to it.
        </$NoRelatedEntityText>
      ) : (
        <$RelatedEntityText>
          This {parentType} has the following authors related to it:
        </$RelatedEntityText>
      )}
    </>
  );
};

export default Meta;

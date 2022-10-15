import { useComponentContext } from "../Context";

import {
  $Description,
  $Heading,
  $NoRelatedEntityText,
  $RelatedEntityText,
} from "^components/related-entity-popover/_styles";

const Meta = () => {
  const [{ parentType, parentCollectionsIds }] = useComponentContext();

  return (
    <>
      <$Heading>Collections</$Heading>
      <$Description>
        Collections are used to group content in a narrower way than a subject,
        or any way you see fit. E.g. &quot;Environment&quot; (collection) vs
        &apos;Politics&apos; (subject). They can be displayed on the landing
        page.
      </$Description>
      {!parentCollectionsIds.length ? (
        <$NoRelatedEntityText>
          This {parentType} has no collections related to it.
        </$NoRelatedEntityText>
      ) : (
        <$RelatedEntityText>
          This {parentType} has the following collections related to it:
        </$RelatedEntityText>
      )}
    </>
  );
};

export default Meta;

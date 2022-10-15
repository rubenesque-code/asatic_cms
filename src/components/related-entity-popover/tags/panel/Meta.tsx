import { useComponentContext } from "../Context";

import {
  $Description,
  $Heading,
  $NoRelatedEntityText,
  $RelatedEntityText,
} from "^components/related-entity-popover/_styles";

const Meta = () => {
  const [{ parentType, parentTagsIds }] = useComponentContext();

  return (
    <>
      <$Heading>Tags</$Heading>
      <$Description>
        Tags allow all documents, such as articles and videos, to be narrowly
        categorised on the website, mainly for search purposes. They can be
        broad, e.g. politics, or narrow, e.g. oil. Documents can have many tags.
      </$Description>
      {!parentTagsIds.length ? (
        <$NoRelatedEntityText>
          This {parentType} has no tags related to it.
        </$NoRelatedEntityText>
      ) : (
        <$RelatedEntityText>
          This {parentType} has the following tags related to it:
        </$RelatedEntityText>
      )}
    </>
  );
};

export default Meta;

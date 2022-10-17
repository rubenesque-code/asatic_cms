import { useComponentContext } from "../Context";

import {
  $Description,
  $Heading,
  $NoRelatedEntityText,
  $RelatedEntityText,
} from "^components/rich-popover/_styles";

const Meta = () => {
  const [{ parentType, parentSubjectsIds: parentSubjectsIds }] =
    useComponentContext();

  return (
    <>
      <$Heading>Subjects</$Heading>
      <$Description>
        Subjects are broad: e.g. biology, art, politics. They are displayed on
        the website menus.
      </$Description>
      {!parentSubjectsIds.length ? (
        <$NoRelatedEntityText>
          This {parentType} has no subjects related to it.
        </$NoRelatedEntityText>
      ) : (
        <$RelatedEntityText>
          This {parentType} has the following subjects related to it:
        </$RelatedEntityText>
      )}
    </>
  );
};

export default Meta;

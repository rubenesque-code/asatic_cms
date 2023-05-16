import { useComponentContext } from "../Context";

import { $Description, $Heading } from "^components/rich-popover/_styles";
import { entityNameToLabel } from "^constants/data";

const Meta = () => {
  const { parentName } = useComponentContext();

  return (
    <>
      <$Heading>Add Article, Blog or Video Document</$Heading>
      <$Description>
        Add article, blog or video document to this{" "}
        {entityNameToLabel(parentName)}.
      </$Description>
    </>
  );
};

export default Meta;

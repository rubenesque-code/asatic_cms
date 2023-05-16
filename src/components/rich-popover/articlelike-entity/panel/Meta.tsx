import { useComponentContext } from "../Context";

import { $Description, $Heading } from "^components/rich-popover/_styles";
import { entityNameToLabel } from "^constants/data";

const Meta = () => {
  const { parentName } = useComponentContext();

  return (
    <>
      <$Heading>Add Article or Blog </$Heading>
      <$Description>
        Add article or blog document to this {entityNameToLabel(parentName)}.
      </$Description>
    </>
  );
};

export default Meta;

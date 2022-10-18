import { useComponentContext } from "../Context";

import { $Description, $Heading } from "^components/rich-popover/_styles";

const Meta = () => {
  const [{ parentType }] = useComponentContext();

  return (
    <>
      <$Heading>Add Article, Blog or Video Document</$Heading>
      <$Description>
        Add article, blog or video document to this {parentType}.
      </$Description>
    </>
  );
};

export default Meta;

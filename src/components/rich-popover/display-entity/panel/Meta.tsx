import { useComponentContext } from "../Context";

import { $Description, $Heading } from "^components/rich-popover/_styles";

const Meta = () => {
  const { parentName } = useComponentContext();

  return (
    <>
      <$Heading>Add Article, Blog, Collection or Video Document</$Heading>
      <$Description>
        Add article, blog, collection or video document to this {parentName}.
      </$Description>
    </>
  );
};

export default Meta;

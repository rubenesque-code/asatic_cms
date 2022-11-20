import { useComponentContext } from "../../Context";

import { $Container } from "^components/rich-popover/_styles/relatedEntities";
import Tag from "./tag";

const Populated = () => {
  const { parentEntityData } = useComponentContext();

  return (
    <$Container>
      {parentEntityData.tagsIds.map((tagId) => (
        <Tag id={tagId} key={tagId} />
      ))}
    </$Container>
  );
};

export default Populated;

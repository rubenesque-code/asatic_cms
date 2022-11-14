import { useComponentContext } from "../../Context";

import { $Container } from "^components/rich-popover/_styles/relatedEntities";
import Tag from "./tag";

const Populated = () => {
  const [relatedEntityData] = useComponentContext();

  return (
    <$Container>
      {relatedEntityData.tagsIds.map((tagId) => (
        <Tag id={tagId} key={tagId} />
      ))}
    </$Container>
  );
};

export default Populated;

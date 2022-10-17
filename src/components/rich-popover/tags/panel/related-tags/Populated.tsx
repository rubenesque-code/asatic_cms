import { useComponentContext } from "../../Context";

import { $Container } from "^components/rich-popover/_styles/relatedEntities";
import Tag from "./tag";

const Populated = () => {
  const [{ parentTagsIds }] = useComponentContext();

  return (
    <$Container>
      {parentTagsIds.map((tagId) => (
        <Tag id={tagId} key={tagId} />
      ))}
    </$Container>
  );
};

export default Populated;

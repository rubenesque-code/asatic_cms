import { useComponentContext } from "../../Context";

import { $Container } from "^components/rich-popover/_styles/relatedEntities";
import Author from "./author";

const Populated = () => {
  const { parentEntityData } = useComponentContext();

  return (
    <$Container>
      {parentEntityData.authorsIds.map((authorId) => (
        <Author id={authorId} key={authorId} />
      ))}
    </$Container>
  );
};

export default Populated;

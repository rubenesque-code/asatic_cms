import { useComponentContext } from "../../Context";

import { $Container } from "^components/related-entity-popover/_styles/relatedEntities";
import Author from "./author";

const Populated = () => {
  const [{ parentAuthorsIds }] = useComponentContext();

  return (
    <$Container>
      {parentAuthorsIds.map((authorId) => (
        <Author id={authorId} key={authorId} />
      ))}
    </$Container>
  );
};

export default Populated;

import { useComponentContext } from "../../Context";

import { $Container } from "^components/related-entity-popover/_styles/relatedEntities";
import Collection from "./collection";

const Populated = () => {
  const [{ parentCollectionsIds }] = useComponentContext();

  return (
    <$Container>
      {parentCollectionsIds.map((collectionId) => (
        <Collection id={collectionId} key={collectionId} />
      ))}
    </$Container>
  );
};

export default Populated;

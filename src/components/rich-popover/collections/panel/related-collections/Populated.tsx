import { useComponentContext } from "../../Context";

import { $Container } from "^components/rich-popover/_styles/relatedEntities";
import Collection from "./collection";

const Populated = () => {
  const { parentEntityData } = useComponentContext();

  return (
    <$Container>
      {parentEntityData.collectionsIds.map((collectionId) => (
        <Collection id={collectionId} key={collectionId} />
      ))}
    </$Container>
  );
};

export default Populated;

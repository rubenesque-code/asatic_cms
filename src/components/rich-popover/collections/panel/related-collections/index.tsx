import { useComponentContext } from "../../Context";
import Populated from "./Populated";

const RelatedEntities = () => {
  const { parentEntityData } = useComponentContext();

  if (!parentEntityData.collectionsIds.length) {
    return null;
  }

  return <Populated />;
};

export default RelatedEntities;

import { useComponentContext } from "../../Context";
import Populated from "./Populated";

const RelatedEntities = () => {
  const [{ parentCollectionsIds }] = useComponentContext();

  if (!parentCollectionsIds.length) {
    return null;
  }

  return <Populated />;
};

export default RelatedEntities;

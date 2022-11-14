import { useComponentContext } from "../../Context";
import Populated from "./Populated";

const RelatedEntities = () => {
  const [relatedEntityData] = useComponentContext();

  if (!relatedEntityData.tagsIds.length) {
    return null;
  }

  return <Populated />;
};

export default RelatedEntities;

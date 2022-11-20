import { useComponentContext } from "../../Context";
import Populated from "./Populated";

const RelatedEntities = () => {
  const { parentEntityData } = useComponentContext();

  if (!parentEntityData.tagsIds.length) {
    return null;
  }

  return <Populated />;
};

export default RelatedEntities;

import { useComponentContext } from "../../Context";
import Populated from "./Populated";

const RelatedEntities = () => {
  const { parentEntityData } = useComponentContext();

  if (!parentEntityData.authorsIds.length) {
    return null;
  }

  return <Populated />;
};

export default RelatedEntities;

import { useComponentContext } from "../../Context";
import Populated from "./Populated";

const RelatedEntities = () => {
  const [{ parentAuthorsIds }] = useComponentContext();

  if (!parentAuthorsIds.length) {
    return null;
  }

  return <Populated />;
};

export default RelatedEntities;

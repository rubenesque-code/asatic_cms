import { useComponentContext } from "../../Context";
import Populated from "./Populated";

const RelatedEntities = () => {
  const [{ parentTagsIds }] = useComponentContext();

  if (!parentTagsIds.length) {
    return null;
  }

  return <Populated />;
};

export default RelatedEntities;

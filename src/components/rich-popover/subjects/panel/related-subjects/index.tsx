import { useComponentContext } from "../../Context";
import Populated from "./Populated";

const RelatedEntities = () => {
  const [{ parentSubjectsIds: parentSubjectsIds }] = useComponentContext();

  if (!parentSubjectsIds.length) {
    return null;
  }

  return <Populated />;
};

export default RelatedEntities;

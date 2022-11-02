import { useComponentContext } from "../../Context";
import Populated from "./Populated";

const RelatedEntities = () => {
  const [{ subjectsIds: parentSubjectsIds }] = useComponentContext();

  if (!parentSubjectsIds.length) {
    return null;
  }

  return <Populated />;
};

export default RelatedEntities;

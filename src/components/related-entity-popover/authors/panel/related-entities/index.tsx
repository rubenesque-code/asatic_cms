import { useComponentContext } from "../../Context";
import Populated from "./populated";

const RelatedType = () => {
  const [{ parentAuthorsIds }] = useComponentContext();

  if (!parentAuthorsIds.length) {
    return null;
  }

  return <Populated />;
};

export default RelatedType;

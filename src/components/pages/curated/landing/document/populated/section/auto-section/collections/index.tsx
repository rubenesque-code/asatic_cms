import { useSelector } from "^redux/hooks";
import { selectTotalCollections } from "^redux/state/collections";

import Empty from "./Empty";
import Populated from "./Populated";

const Collections = () => {
  const numCollections = useSelector(selectTotalCollections);

  return numCollections ? <Populated /> : <Empty />;
};

export default Collections;

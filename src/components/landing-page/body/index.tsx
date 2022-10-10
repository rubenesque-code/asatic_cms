import { useSelector } from "^redux/hooks";
import { selectTotal } from "^redux/state/landing";

import Empty from "./Empty";
import Populated from "./Populated";

const Body = () => {
  const numSections = useSelector(selectTotal);

  return numSections ? <Populated /> : <Empty />;
};

export default Body;

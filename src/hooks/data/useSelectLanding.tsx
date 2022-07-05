import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/articles";

const useSelectLanding = () => {
  const landingSections = useSelector(selectAll);

  return landingSections;
};

export default useSelectLanding;

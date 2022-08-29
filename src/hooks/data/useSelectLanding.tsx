import { useSelector } from "^redux/hooks";
import { selectArticles } from "^redux/state/articles";

const useSelectLanding = () => {
  const landingSections = useSelector(selectArticles);

  return landingSections;
};

export default useSelectLanding;

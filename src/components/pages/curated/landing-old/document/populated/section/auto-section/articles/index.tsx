import { useSelector } from "^redux/hooks";
import { selectTotalArticles } from "^redux/state/articles";

import Empty from "./Empty";
import Populated from "./Populated";

const Articles = () => {
  const numArticles = useSelector(selectTotalArticles);

  return numArticles ? <Populated /> : <Empty />;
};

export default Articles;

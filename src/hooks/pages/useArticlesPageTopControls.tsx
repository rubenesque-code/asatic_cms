import useArticlesTopControls from "^hooks/data/useArticlesTopControls";
import { useSaveArticlesPageMutation } from "^redux/services/saves";

const useArticlesPageTopControls = () => {
  const [save, saveMutationData] = useSaveArticlesPageMutation();
  const saveId = saveMutationData.requestId;

  const topControlObjs = {
    articles: useArticlesTopControls({ saveId }),
  };
  const topControlObjsArr = Object.values(topControlObjs);

  const handleSave = () => save({ articles: topControlObjs.articles.saveData });

  const handleUndo = () => topControlObjsArr.forEach((obj) => obj.handleUndo());

  const isChange = Boolean(topControlObjsArr.find((obj) => obj.isChange));

  return {
    isChange,
    handleSave,
    handleUndo,
    saveMutationData,
  };
};

export default useArticlesPageTopControls;

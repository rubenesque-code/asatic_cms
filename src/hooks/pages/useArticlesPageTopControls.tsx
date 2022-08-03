import { useSaveArticlesPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  overWriteAll as overWriteArticles,
  selectAll as selectArticles,
} from "^redux/state/articles";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";

const useArticlesPageTopControls = () => {
  const [save, saveMutationData] = useSaveArticlesPageMutation();
  const saveId = saveMutationData.requestId;

  const articlesCurrentData = useSelector(selectArticles);

  const dispatch = useDispatch();
  const topControlObj = {
    articles: useTopControlsForCollection({
      currentData: articlesCurrentData,
      onUndo: (previousData) =>
        dispatch(overWriteArticles({ data: previousData })),
      saveId,
    }),
  };

  const topControlArr = Object.values(topControlObj);
  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));

  const canSave = isChange && !saveMutationData.isLoading;
  const handleSave = () => {
    if (!canSave) {
      return;
    }
    save({
      articles: topControlObj.articles.saveData,
    });
  };

  const handleUndo = () => {
    topControlArr.forEach((obj) => obj.handleUndo());
  };

  return {
    isChange,
    handleSave,
    handleUndo,
    saveMutationData,
  };
};

export default useArticlesPageTopControls;

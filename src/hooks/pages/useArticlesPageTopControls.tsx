import { useSaveArticlesPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  overWriteAll as overWriteArticles,
  selectAll as selectArticles,
} from "^redux/state/articles";

import useTopControls from "^hooks/useTopControlsArr";

const useArticlesPageTopControls = () => {
  const [save, saveMutationData] = useSaveArticlesPageMutation();
  const saveId = saveMutationData.requestId;

  const articlesCurrentData = useSelector(selectArticles);

  const dispatch = useDispatch();
  const topControlObj = {
    articles: useTopControls({
      currentData: articlesCurrentData,
      onUndo: (previousData) =>
        dispatch(overWriteArticles({ data: previousData })),
      saveId,
    }),
  };

  const topControlArr = Object.values(topControlObj);

  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));

  // below works but isn't type safe
  /*   const saveObj = Object.entries(topControlObj)
    .map((el) => ({
      [el[0]]: el[1].saveData,
    }))
    .reduce((_prev, obj) => 
      obj
    ); */

  const handleSave = () =>
    save({
      articles: topControlObj.articles.saveData,
    });

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

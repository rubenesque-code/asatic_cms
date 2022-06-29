import { useSaveLandingPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  overWriteAll as overWriteArticles,
  selectAll as selectArticles,
} from "^redux/state/articles";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";
import useTopControlsForImages from "^hooks/useTopControlsForImages";

const useLandingPageTopControls = () => {
  const [save, saveMutationData] = useSaveLandingPageMutation();
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
    images: useTopControlsForImages({
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
      images: topControlObj.images.saveData,
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

export default useLandingPageTopControls;

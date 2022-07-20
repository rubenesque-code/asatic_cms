import { useSaveLandingPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  overWriteAll as overWriteArticles,
  selectAll as selectArticles,
} from "^redux/state/articles";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";
import useTopControlsForImages from "^hooks/useTopControlsForImages";
import {
  overWriteAll as overWriteLanding,
  selectAll as selectLandingSections,
} from "^redux/state/landing";

const useLandingPageTopControls = () => {
  const [save, saveMutationData] = useSaveLandingPageMutation();
  const saveId = saveMutationData.requestId;

  const articlesCurrentData = useSelector(selectArticles);
  const landingCurrentData = useSelector(selectLandingSections);

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
    landing: useTopControlsForCollection({
      currentData: landingCurrentData,
      onUndo: (previousData) =>
        dispatch(overWriteLanding({ data: previousData })),
      saveId,
    }),
  };

  const topControlArr = Object.values(topControlObj);

  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));

  const handleSave = () =>
    save({
      articles: topControlObj.articles.saveData,
      images: topControlObj.images.saveData,
      landingSections: topControlObj.landing.saveData,
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
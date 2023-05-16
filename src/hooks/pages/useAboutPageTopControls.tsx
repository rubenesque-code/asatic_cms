import { useSaveAboutPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import { overWriteAll, selectAll } from "^redux/state/about";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";

const useLandingPageTopControls = () => {
  const [saveToDatabase, saveMutationData] = useSaveAboutPageMutation();
  const saveId = saveMutationData.requestId;

  const aboutPages = useSelector(selectAll);

  const dispatch = useDispatch();
  const docTopControlMappings = {
    aboutPages: useTopControlsForCollection({
      currentData: aboutPages,
      onUndo: (previousData) => dispatch(overWriteAll({ data: previousData })),
      saveId,
    }),
  };

  const saveData = {
    aboutPages: docTopControlMappings.aboutPages.saveData,
  };

  const topControlArr = Object.values(docTopControlMappings);
  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));

  const handleSave = () => {
    if (!isChange) {
      return;
    }
    saveToDatabase({ about: saveData.aboutPages.newAndUpdated });
  };

  const handleUndo = () => {
    if (!isChange) {
      return;
    }
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

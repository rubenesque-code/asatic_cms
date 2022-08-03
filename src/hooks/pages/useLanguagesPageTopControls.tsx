import { useSaveLanguagesPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  selectAll as selectLanguages,
  overWriteAll as overWriteLanguages,
} from "^redux/state/languages";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";

const useLanguagesPageTopControls = () => {
  const [saveToDatabase, saveMutationData] = useSaveLanguagesPageMutation();
  const saveId = saveMutationData.requestId;

  const languages = useSelector(selectLanguages);

  const dispatch = useDispatch();
  const docTopControlMappings = {
    languages: useTopControlsForCollection({
      currentData: languages,
      onUndo: (previousData) =>
        dispatch(overWriteLanguages({ data: previousData })),
      saveId,
    }),
  };

  const saveData = {
    languages: docTopControlMappings.languages.saveData,
  };

  const topControlArr = Object.values(docTopControlMappings);
  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));

  const canSave = isChange && !saveMutationData.isLoading;
  const handleSave = () => {
    if (!canSave) {
      return;
    }
    saveToDatabase(saveData);
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

export default useLanguagesPageTopControls;

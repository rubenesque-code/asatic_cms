import { useSaveImagesPageMutation } from "^redux/services/saves";

import useTopControlsForImages from "^hooks/useTopControlsForImages";

const useImagesPageTopControls = () => {
  const [saveToDatabase, saveMutationData] = useSaveImagesPageMutation();
  const saveId = saveMutationData.requestId;

  const {
    isChange,
    saveData,
    handleUndo: undo,
  } = useTopControlsForImages({
    saveId,
  });

  const canSave = isChange && !saveMutationData.isLoading;
  const handleSave = () => {
    if (canSave) {
      saveToDatabase(saveData.newAndUpdated);
    }
  };

  const handleUndo = () => {
    const canUndo = isChange;
    if (canUndo) {
      undo();
    }
  };

  return {
    canSave,
    isChange,
    handleSave,
    handleUndo,
    saveMutationData,
  };
};

export default useImagesPageTopControls;

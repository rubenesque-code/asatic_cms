import isEqual from "lodash.isequal";

import { useSaveImagesPageMutation } from "^redux/services/saves";

import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/images";

import useUpdateablePrevious from "^hooks/useUpdateablePrevious";

const useImagesPageTopControls = () => {
  const [saveToDatabase, saveMutationData] = useSaveImagesPageMutation();
  const saveId = saveMutationData.requestId;

  const currentImages = useSelector(selectAll);
  const initialImages = useUpdateablePrevious({
    currentData: currentImages,
    dependencyToUpdateOn: saveId,
  });

  const isChange = !isEqual(initialImages, currentImages);

  const canSave = isChange && !saveMutationData.isLoading;
  const handleSave = () => {
    if (canSave) {
      saveToDatabase(currentImages);
    }
  };

  return {
    canSave,
    isChange,
    handleSave,
    saveMutationData,
  };
};

export default useImagesPageTopControls;

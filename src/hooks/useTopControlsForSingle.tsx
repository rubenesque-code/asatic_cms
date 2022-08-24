import isEqual from "lodash.isequal";

import useUpdateablePrevious from "./useUpdateablePrevious";

function useTopControlsForSingle<T extends { id: string }>({
  currentData,
  onUndo,
  saveId,
}: {
  currentData: T;
  onUndo: (data: T) => void;
  saveId: string | undefined;
}) {
  const previousData = useUpdateablePrevious({
    currentData,
    updateOn: saveId,
  });

  const isChange = !isEqual(previousData, currentData);

  const canUndo = isChange && previousData;

  const handleUndo = () => canUndo && onUndo(previousData);

  return {
    isChange,
    handleUndo,
  };
}

export default useTopControlsForSingle;

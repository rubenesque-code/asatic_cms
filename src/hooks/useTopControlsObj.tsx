import isEqual from "lodash.isequal";

import usePrevious from "./usePrevious";

function useTopControlsArr<T extends { id: string }>({
  currentData,
  onUndo,
  saveId,
}: {
  currentData: T;
  onUndo: (data: T) => void;
  saveId: string | undefined;
}) {
  const previousData = usePrevious({ currentData, updateOnId: saveId });

  const isChange = !isEqual(previousData, currentData);

  const canUndo = isChange && previousData;

  const handleUndo = () => canUndo && onUndo(previousData);

  return {
    isChange,
    handleUndo,
  };
}

export default useTopControlsArr;

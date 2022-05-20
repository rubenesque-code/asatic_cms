import isEqual from "lodash.isequal";

import { arrayDivergence, mapIds } from "^helpers/general";

import usePrevious from "./usePrevious";

function useTopControlsArr<T extends { id: string }>({
  currentData,
  onUndo,
  saveId,
}: {
  currentData: T[];
  onUndo: (data: T[]) => void;
  saveId: string | undefined;
}) {
  const currentIds = mapIds(currentData);

  const previousData = usePrevious({ currentData, updateOnId: saveId });
  const previousIds = mapIds(previousData);

  const removedIds = previousIds
    ? arrayDivergence(previousIds, currentIds)
    : [];

  const isChange = !isEqual(previousData, currentData);

  const canUndo = isChange && previousData;

  const handleUndo = () => canUndo && onUndo(previousData);

  return {
    isChange,
    saveData: {
      deleted: removedIds,
      newAndUpdated: currentData,
    },
    handleUndo,
  };
}

export default useTopControlsArr;

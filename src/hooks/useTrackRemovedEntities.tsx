import { arrayDivergence, mapIds } from "^helpers/general";
import useUpdateablePrevious from "./useUpdateablePrevious";

function useTrackRemovedEntities<T extends { id: string }>({
  currentData,
  saveId,
}: {
  currentData: T[];
  saveId: string | undefined;
}) {
  const currentIds = mapIds(currentData);

  const previousData = useUpdateablePrevious({
    currentData,
    dependencyToUpdateOn: saveId,
  });
  const previousIds = mapIds(previousData);

  const removedIds = previousIds
    ? arrayDivergence(previousIds, currentIds)
    : [];

  return removedIds;
}

export default useTrackRemovedEntities;

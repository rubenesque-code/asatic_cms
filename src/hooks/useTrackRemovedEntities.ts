import { arrayDivergence } from "^helpers/general";
import useUpdateablePrevious from "./useUpdateablePrevious";

function useTrackRemovedEntities({
  ids: currentIds,
  updateOnId,
}: {
  ids: string[];
  updateOnId: string | undefined;
}) {
  const prevIds = useUpdateablePrevious({
    currentData: currentIds,
    dependencyToUpdateOn: updateOnId,
  });

  const removedIds = prevIds ? arrayDivergence(prevIds, currentIds) : [];

  return removedIds;
}

export default useTrackRemovedEntities;

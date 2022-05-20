import { arrayDivergence } from "^helpers/general";
import usePrevious from "./usePrevious";

function useTrackRemovedEntities({
  ids: currentIds,
  updateOnId,
}: {
  ids: string[];
  updateOnId: string | undefined;
}) {
  const prevIds = usePrevious({ currentData: currentIds, updateOnId });

  const removedIds = prevIds ? arrayDivergence(prevIds, currentIds) : [];

  return removedIds;
}

export default useTrackRemovedEntities;

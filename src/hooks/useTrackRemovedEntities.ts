import { arrayDivergence, mapIds } from "^helpers/general";
import usePrevious from "./usePrevState";

function useTrackRemovedEntities<T extends { id: string }>({
  data,
  updateOnId,
}: {
  data: T[];
  updateOnId: string | undefined;
}) {
  const currentIds = mapIds(data);
  const prevIds = usePrevious({ data: currentIds, updateOnId });

  const removedIds = prevIds ? arrayDivergence(prevIds, currentIds) : [];

  return removedIds;
}

export default useTrackRemovedEntities;

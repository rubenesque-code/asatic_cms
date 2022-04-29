import { useDispatch, useSelector } from "^redux/hooks";
import isEqual from "lodash.isequal";
import usePrevious from "^hooks/usePrevState";
import useTrackRemovedEntities from "^hooks/useTrackRemovedEntities";
import { overWriteAll, selectAll } from "^redux/state/articles";

type Selector = Parameters<typeof useSelector>[0];
function useTopControls({
  saveId,
  selector,
}: {
  saveId: string | undefined;
  selector: Selector;
}) {
  const dispatch = useDispatch();
  const data = useSelector(selector);

  const prevData = usePrevious({
    data,
    updateOnId: saveId,
  });

  const deleted = useTrackRemovedEntities({ data, updateOnId: saveId });

  const isChange = !isEqual(prevData, data);

  const handleUndo = () => {
    if (!isChange || !prevData) {
      return;
    }
    dispatch(overWriteAll({ data: prevData }));
  };

  return;
}

export default useTopControls;

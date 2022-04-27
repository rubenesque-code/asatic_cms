import { useDispatch, useSelector } from "^redux/hooks";
import isEqual from "lodash.isequal";
import usePrevious from "^hooks/usePrevState";
import useTrackRemovedEntities from "^hooks/useTrackRemovedEntities";
import { overWriteAll, selectAll } from "^redux/state/articles";

const useArticlesTopControls = ({ saveId }: { saveId: string | undefined }) => {
  const dispatch = useDispatch();
  const data = useSelector(selectAll);
  console.log("data", data);

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

  return {
    saveData: {
      deleted,
      newAndUpdated: data,
    },
    handleUndo,
    isChange,
  };
};

export default useArticlesTopControls;

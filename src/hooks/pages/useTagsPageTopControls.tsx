import { useSaveTagsPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  selectAll as selectTags,
  overWriteAll as overWriteTags,
} from "^redux/state/tags";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";

const useTagsPageTopControls = () => {
  const [saveToDatabase, saveMutationData] = useSaveTagsPageMutation();
  const saveId = saveMutationData.requestId;

  const tags = useSelector(selectTags);

  const dispatch = useDispatch();
  const docTopControlMappings = {
    tags: useTopControlsForCollection({
      currentData: tags,
      onUndo: (previousData) => dispatch(overWriteTags({ data: previousData })),
      saveId,
    }),
  };

  const saveData = {
    tags: docTopControlMappings.tags.saveData,
  };
  const handleSave = () => {
    saveToDatabase(saveData);
  };

  const topControlArr = Object.values(docTopControlMappings);

  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));
  const handleUndo = () => {
    topControlArr.forEach((obj) => obj.handleUndo());
  };

  return {
    isChange,
    handleSave,
    handleUndo,
    saveMutationData,
  };
};

export default useTagsPageTopControls;

import { useSaveRecordedEventTypesPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  selectRecordedEventTypes,
  overWriteAll as overWriteRecordedEventTypes,
} from "^redux/state/recordedEventsTypes";
import {
  selectRecordedEvents,
  undoAll as undoRecordedEvents,
} from "^redux/state/recordedEvents";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";

const useAuthorsPageSaveUndo = () => {
  const [saveToDatabase, saveMutationData] =
    useSaveRecordedEventTypesPageMutation();
  const saveId = saveMutationData.requestId;

  const recordedEventTypes = useSelector(selectRecordedEventTypes);
  const recordedEvents = useSelector(selectRecordedEvents);

  const dispatch = useDispatch();
  const docTopControlMappings = {
    recordedEventTypes: useTopControlsForCollection({
      currentData: recordedEventTypes,
      onUndo: (previousData) =>
        dispatch(overWriteRecordedEventTypes(previousData)),
      saveId,
    }),
    recordedEvents: useTopControlsForCollection({
      currentData: recordedEvents,
      onUndo: (previousData) => dispatch(undoRecordedEvents(previousData)),
      saveId,
    }),
  };

  const topControlArr = Object.values(docTopControlMappings);
  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));

  const handleSave = async () => {
    if (!isChange) {
      return;
    }
    await saveToDatabase({
      recordedEventTypes: docTopControlMappings.recordedEventTypes.saveData,
      recordedEvents: {
        updated: docTopControlMappings.recordedEvents.saveData.newAndUpdated,
      },
    });
  };

  const handleUndo = () => {
    if (!isChange) {
      return;
    }
    topControlArr.forEach((obj) => obj.handleUndo());
  };

  return {
    isChange,
    handleSave,
    handleUndo,
    saveMutationData,
  };
};

export default useAuthorsPageSaveUndo;

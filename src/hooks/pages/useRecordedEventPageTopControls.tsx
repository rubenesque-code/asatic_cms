import { useSaveRecordedEventPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  selectAuthors as selectAuthors,
  overWriteAll as overWriteAuthors,
} from "^redux/state/authors";
import {
  selectCollections as selectCollections,
  undoAll as overWriteCollections,
} from "^redux/state/collections";
import {
  selectLanguages,
  overWriteAll as overWriteLanguages,
} from "^redux/state/languages";
import {
  selectSubjects as selectSubjects,
  overWriteAll as overWriteSubjects,
} from "^redux/state/subjects";
import { selectTags, overWriteAll as overWriteTags } from "^redux/state/tags";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";
import useTopControlsForSingle from "^hooks/useTopControlsForSingle";
import useGetSubRouteId from "^hooks/useGetSubRouteId";
import {
  selectRecordedEventById,
  undoOne as overWriteRecordedEvent,
  updateSaveDate as updateRecordedEventSaveDate,
} from "^redux/state/recordedEvents";

const useRecordedEventsPageTopControls = () => {
  const [saveToDatabase, saveMutationData] = useSaveRecordedEventPageMutation();
  const saveId = saveMutationData.requestId;

  const recordedEventId = useGetSubRouteId();

  const recordedEvent = useSelector((state) =>
    selectRecordedEventById(state, recordedEventId)
  )!;
  const authors = useSelector(selectAuthors);
  const collections = useSelector(selectCollections);
  const languages = useSelector(selectLanguages);
  const subjects = useSelector(selectSubjects);
  const tags = useSelector(selectTags);

  const dispatch = useDispatch();
  const docTopControlMappings = {
    recordedEvent: useTopControlsForSingle({
      currentData: recordedEvent,
      onUndo: (previousData) => dispatch(overWriteRecordedEvent(previousData)),
      saveId,
    }),
    authors: useTopControlsForCollection({
      currentData: authors,
      onUndo: (previousData) =>
        dispatch(overWriteAuthors({ data: previousData })),
      saveId,
    }),
    collections: useTopControlsForCollection({
      currentData: collections,
      onUndo: (previousData) => dispatch(overWriteCollections(previousData)),
      saveId,
    }),
    languages: useTopControlsForCollection({
      currentData: languages,
      onUndo: (previousData) =>
        dispatch(overWriteLanguages({ data: previousData })),
      saveId,
    }),
    subjects: useTopControlsForCollection({
      currentData: subjects,
      onUndo: (previousData) => dispatch(overWriteSubjects(previousData)),
      saveId,
    }),
    tags: useTopControlsForCollection({
      currentData: tags,
      onUndo: (previousData) => dispatch(overWriteTags({ data: previousData })),
      saveId,
    }),
  };

  const saveDate = new Date();
  const saveData = {
    recordedEvent: {
      ...recordedEvent,
      lastSave: saveDate,
    },
    authors: docTopControlMappings.authors.saveData,
    collections: docTopControlMappings.collections.saveData,
    languages: docTopControlMappings.languages.saveData,
    subjects: docTopControlMappings.subjects.saveData,
    tags: docTopControlMappings.tags.saveData,
  };

  const topControlArr = Object.values(docTopControlMappings);
  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));

  const handleSave = () => {
    if (!isChange) {
      return;
    }
    dispatch(
      updateRecordedEventSaveDate({ id: recordedEventId, date: saveDate })
    );
    saveToDatabase(saveData);
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

export default useRecordedEventsPageTopControls;

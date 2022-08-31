import { useSaveCollectionPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import { undoAll as undoArticles, selectArticles } from "^redux/state/articles";
import { undoAll as undoBlogs, selectBlogs } from "^redux/state/blogs";
import {
  selectCollectionById,
  undoOne as undoCollection,
  updateSaveDate,
} from "^redux/state/collections";
import {
  selectLanguages,
  overWriteAll as overWriteLanguages,
} from "^redux/state/languages";
import {
  undoAll as undoRecordedEvents,
  selectRecordedEvents,
} from "^redux/state/recordedEvents";
import {
  selectSubjects as selectSubjects,
  overWriteAll as overWriteSubjects,
} from "^redux/state/subjects";
import { selectTags, overWriteAll as overWriteTags } from "^redux/state/tags";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";
import useTopControlsForSingle from "^hooks/useTopControlsForSingle";
import useGetSubRouteId from "^hooks/useGetSubRouteId";
import useTopControlsForImages from "^hooks/useTopControlsForImages";

const useCollectionPageTopControls = () => {
  const [saveToDatabase, saveMutationData] = useSaveCollectionPageMutation();
  const saveId = saveMutationData.requestId;

  const collectionId = useGetSubRouteId();

  const articles = useSelector(selectArticles);
  const blogs = useSelector(selectBlogs);
  const collection = useSelector((state) =>
    selectCollectionById(state, collectionId)
  )!;
  const languages = useSelector(selectLanguages);
  const recordedEvents = useSelector(selectRecordedEvents);
  const subjects = useSelector(selectSubjects);
  const tags = useSelector(selectTags);

  const dispatch = useDispatch();
  const docTopControlMappings = {
    articles: useTopControlsForCollection({
      currentData: articles,
      onUndo: (previousData) => dispatch(undoArticles(previousData)),
      saveId,
    }),
    blogs: useTopControlsForCollection({
      currentData: blogs,
      onUndo: (previousData) => dispatch(undoBlogs(previousData)),
      saveId,
    }),
    collection: useTopControlsForSingle({
      currentData: collection,
      onUndo: (previousData) => dispatch(undoCollection(previousData)),
      saveId,
    }),
    images: useTopControlsForImages({
      saveId,
    }),
    languages: useTopControlsForCollection({
      currentData: languages,
      onUndo: (previousData) =>
        dispatch(overWriteLanguages({ data: previousData })),
      saveId,
    }),
    recordedEvents: useTopControlsForCollection({
      currentData: recordedEvents,
      onUndo: (previousData) => dispatch(undoRecordedEvents(previousData)),
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
    collection: {
      ...collection,
      lastSave: saveDate,
    },
    articles: docTopControlMappings.articles.saveData,
    blogs: docTopControlMappings.blogs.saveData,
    images: docTopControlMappings.images.saveData,
    languages: docTopControlMappings.languages.saveData,
    recordedEvents: docTopControlMappings.recordedEvents.saveData,
    subjects: docTopControlMappings.subjects.saveData,
    tags: docTopControlMappings.tags.saveData,
  };

  const topControlArr = Object.values(docTopControlMappings);
  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));

  const handleSave = () => {
    if (!isChange) {
      return;
    }
    dispatch(updateSaveDate({ id: collectionId, date: saveDate }));
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

export default useCollectionPageTopControls;

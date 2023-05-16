import { useSaveTagsPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import { selectTags, overWriteAll as overWriteTags } from "^redux/state/tags";
import { undoAll as undoArticles } from "^redux/state/articles";
import { undoAll as undoBlogs } from "^redux/state/blogs";
import { undoAll as undoCollections } from "^redux/state/collections";
import { undoAll as undoRecordedEvents } from "^redux/state/recordedEvents";
import { undoAll as undoSubjects } from "^redux/state/subjects";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";
import useDisplayDocuments from "^hooks/useDisplayDocuments";

const useTagsPageSaveUndo = () => {
  const [saveToDatabase, saveMutationData] = useSaveTagsPageMutation();
  const saveId = saveMutationData.requestId;

  const tags = useSelector(selectTags);
  const { articles, blogs, collections, recordedEvents, subjects } =
    useDisplayDocuments();

  const dispatch = useDispatch();
  const docTopControlMappings = {
    tags: useTopControlsForCollection({
      currentData: tags,
      onUndo: (previousData) => dispatch(overWriteTags({ data: previousData })),
      saveId,
    }),
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
    collections: useTopControlsForCollection({
      currentData: collections,
      onUndo: (previousData) => dispatch(undoCollections(previousData)),
      saveId,
    }),
    recordedEvents: useTopControlsForCollection({
      currentData: recordedEvents,
      onUndo: (previousData) => dispatch(undoRecordedEvents(previousData)),
      saveId,
    }),
    subjects: useTopControlsForCollection({
      currentData: subjects,
      onUndo: (previousData) => dispatch(undoSubjects(previousData)),
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
      tags: docTopControlMappings.tags.saveData,
      articles: {
        updated: docTopControlMappings.articles.saveData.newAndUpdated,
      },
      blogs: {
        updated: docTopControlMappings.blogs.saveData.newAndUpdated,
      },
      collections: {
        updated: docTopControlMappings.collections.saveData.newAndUpdated,
      },
      recordedEvents: {
        updated: docTopControlMappings.recordedEvents.saveData.newAndUpdated,
      },
      subjects: {
        updated: docTopControlMappings.subjects.saveData.newAndUpdated,
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

export default useTagsPageSaveUndo;

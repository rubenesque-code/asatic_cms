import { useSaveAuthorsPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  selectAuthors as selectAuthors,
  overWriteAll as overWriteAuthors,
} from "^redux/state/authors";
import { undoAll as undoArticles } from "^redux/state/articles";
import { undoAll as undoBlogs } from "^redux/state/blogs";
import { undoAll as undoRecordedEvents } from "^redux/state/recordedEvents";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";
import usePrimaryDocuments from "^hooks/usePrimaryDocuments";

const useAuthorsPageSaveUndo = () => {
  const [saveToDatabase, saveMutationData] = useSaveAuthorsPageMutation();
  const saveId = saveMutationData.requestId;

  const authors = useSelector(selectAuthors);
  const { articles, blogs, recordedEvents } = usePrimaryDocuments();

  const dispatch = useDispatch();
  const docTopControlMappings = {
    authors: useTopControlsForCollection({
      currentData: authors,
      onUndo: (previousData) =>
        dispatch(overWriteAuthors({ data: previousData })),
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
      authors: docTopControlMappings.authors.saveData,
      articles: {
        updated: docTopControlMappings.articles.saveData.newAndUpdated,
      },
      blogs: {
        updated: docTopControlMappings.blogs.saveData.newAndUpdated,
      },
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

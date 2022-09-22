import { useSaveLandingPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import { undoAll as undoArticles, selectArticles } from "^redux/state/articles";
import { selectBlogs, undoAll as undoBlogs } from "^redux/state/blogs";
import {
  selectCollections as selectCollections,
  undoAll as undoCollections,
} from "^redux/state/collections";
import {
  selectRecordedEvents,
  undoAll as undoRecordedEvents,
} from "^redux/state/recordedEvents";
import {
  selectAll as selectLanding,
  overWriteAll as undoLanding,
} from "^redux/state/landing";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";
import useTopControlsForImages from "^hooks/useTopControlsForImages";

const useLandingPageTopControls = () => {
  const [saveToDatabase, saveMutationData] = useSaveLandingPageMutation();
  const saveId = saveMutationData.requestId;

  const articles = useSelector(selectArticles);
  const blogs = useSelector(selectBlogs);
  const collections = useSelector(selectCollections);
  const recordedEvents = useSelector(selectRecordedEvents);
  const landingSections = useSelector(selectLanding);

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
    images: useTopControlsForImages({
      saveId,
    }),
    landing: useTopControlsForCollection({
      currentData: landingSections,
      onUndo: (previousData) => dispatch(undoLanding({ data: previousData })),
      saveId,
    }),
  };

  const saveData = {
    articles: docTopControlMappings.articles.saveData,
    blogs: docTopControlMappings.blogs.saveData,
    collections: docTopControlMappings.collections.saveData,
    recordedEvents: docTopControlMappings.recordedEvents.saveData,
    images: docTopControlMappings.images.saveData.newAndUpdated,
    landingSections: docTopControlMappings.landing.saveData,
  };

  const topControlArr = Object.values(docTopControlMappings);
  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));

  const handleSave = () => {
    if (!isChange) {
      return;
    }
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

export default useLandingPageTopControls;

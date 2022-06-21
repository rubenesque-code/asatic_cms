import { useSaveArticlePageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  overWriteOne as overWriteArticle,
  selectById as selectArticleById,
  updateSaveDate as updateArticleSaveDate,
} from "^redux/state/articles";
import {
  selectAll as selectAuthors,
  overWriteAll as overWriteAuthors,
} from "^redux/state/authors";
import {
  selectAll as selectLanguages,
  overWriteAll as overWriteLanguages,
} from "^redux/state/languages";
import {
  selectAll as selectTags,
  overWriteAll as overWriteTags,
} from "^redux/state/tags";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";
import useTopControlsForSingle from "^hooks/useTopControlsForSingle";
import useGetSubRouteId from "^hooks/useGetSubRouteId";
import useTopControlsForImages from "^hooks/useTopControlsForImages";

const useArticlePageTopControls = () => {
  const [saveToDatabase, saveMutationData] = useSaveArticlePageMutation();
  const saveId = saveMutationData.requestId;

  const articleId = useGetSubRouteId();

  const article = useSelector((state) => selectArticleById(state, articleId))!;
  const authors = useSelector(selectAuthors);
  const tags = useSelector(selectTags);
  const languages = useSelector(selectLanguages);

  const dispatch = useDispatch();
  const docTopControlMappings = {
    article: useTopControlsForSingle({
      currentData: article,
      onUndo: (previousData) =>
        dispatch(overWriteArticle({ data: previousData })),
      saveId,
    }),
    authors: useTopControlsForCollection({
      currentData: authors,
      onUndo: (previousData) =>
        dispatch(overWriteAuthors({ data: previousData })),
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
    tags: useTopControlsForCollection({
      currentData: tags,
      onUndo: (previousData) => dispatch(overWriteTags({ data: previousData })),
      saveId,
    }),
  };

  const saveDate = new Date();
  const saveData = {
    article: {
      ...article,
      lastSave: saveDate,
    },
    authors: docTopControlMappings.authors.saveData,
    images: docTopControlMappings.images.saveData,
    languages: docTopControlMappings.languages.saveData,
    tags: docTopControlMappings.tags.saveData,
  };
  const handleSave = () => {
    dispatch(updateArticleSaveDate({ id: articleId, date: saveDate }));
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

export default useArticlePageTopControls;

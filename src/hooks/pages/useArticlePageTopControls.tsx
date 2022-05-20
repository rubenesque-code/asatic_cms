import { useSaveArticlePageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  overWriteOne as overWriteArticle,
  selectById as selectArticleById,
} from "^redux/state/articles";
import {
  selectAll as selectAuthors,
  overWriteAll as overWriteAuthors,
} from "^redux/state/authors";
import {
  selectAll as selectTags,
  overWriteAll as overWriteTags,
} from "^redux/state/tags";

import useTopControlsArr from "^hooks/useTopControlsArr";
import useTopControlsObj from "^hooks/useTopControlsObj";
import useGetSubRouteId from "^hooks/useGetSubRouteId";

const useArticlePageTopControls = () => {
  const [save, saveMutationData] = useSaveArticlePageMutation();
  const saveId = saveMutationData.requestId;

  const articleId = useGetSubRouteId();
  const articleCurrentData = useSelector((state) =>
    selectArticleById(state, articleId)
  )!;

  const authors = useSelector(selectAuthors);
  const tags = useSelector(selectTags);

  const dispatch = useDispatch();
  const topControlObj = {
    article: useTopControlsObj({
      currentData: articleCurrentData,
      onUndo: (previousData) =>
        dispatch(overWriteArticle({ data: previousData })),
      saveId,
    }),
    authors: useTopControlsArr({
      currentData: authors,
      onUndo: (previousData) =>
        dispatch(overWriteAuthors({ data: previousData })),
      saveId,
    }),
    tags: useTopControlsArr({
      currentData: tags,
      onUndo: (previousData) => dispatch(overWriteTags({ data: previousData })),
      saveId,
    }),
  };

  const topControlArr = Object.values(topControlObj);

  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));

  const handleSave = () =>
    save({
      article: articleCurrentData,
      authors: topControlObj.authors.saveData,
      tags: topControlObj.tags.saveData,
    });

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

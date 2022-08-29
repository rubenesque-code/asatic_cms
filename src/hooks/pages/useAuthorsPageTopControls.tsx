import { useSaveAuthorsPageMutation } from "^redux/services/saves";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  overWriteAll as overWriteArticles,
  selectArticles as selectArticles,
} from "^redux/state/articles";
import {
  selectAuthors as selectAuthors,
  overWriteAll as overWriteAuthors,
} from "^redux/state/authors";
import {
  selectAll as selectLanguages,
  overWriteAll as overWriteLanguages,
} from "^redux/state/languages";

import useTopControlsForCollection from "^hooks/useTopControlsForCollection";

const useAuthorsPageTopControls = () => {
  const [saveToDatabase, saveMutationData] = useSaveAuthorsPageMutation();
  const saveId = saveMutationData.requestId;

  // * articles.authorIds updates when delete an author
  const articles = useSelector(selectArticles);
  const authors = useSelector(selectAuthors);
  const languages = useSelector(selectLanguages);

  const dispatch = useDispatch();
  const docTopControlMappings = {
    articles: useTopControlsForCollection({
      currentData: articles,
      onUndo: (previousData) =>
        dispatch(overWriteArticles({ data: previousData })),
      saveId,
    }),
    authors: useTopControlsForCollection({
      currentData: authors,
      onUndo: (previousData) =>
        dispatch(overWriteAuthors({ data: previousData })),
      saveId,
    }),
    languages: useTopControlsForCollection({
      currentData: languages,
      onUndo: (previousData) =>
        dispatch(overWriteLanguages({ data: previousData })),
      saveId,
    }),
  };

  const saveData = {
    articles: docTopControlMappings.articles.saveData,
    authors: docTopControlMappings.authors.saveData,
    languages: docTopControlMappings.languages.saveData,
  };

  const topControlArr = Object.values(docTopControlMappings);
  const isChange = Boolean(topControlArr.find((obj) => obj.isChange));

  const canSave = isChange && !saveMutationData.isLoading;
  const handleSave = () => {
    if (!canSave) {
      return;
    }
    saveToDatabase(saveData);
  };

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

export default useAuthorsPageTopControls;

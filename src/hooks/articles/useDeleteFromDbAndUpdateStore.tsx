import { useDeleteArticleMutation } from "^redux/services/articles";

import ArticleSlice from "^context/articles/ArticleContext";

import useUpdateStoreRelatedEntitiesOnDelete from "./useUpdateStoreRelatedEntitiesOnDelete";

const useDeleteArticle = () => {
  const [{ id: articleId, collectionsIds, authorsIds, subjectsIds, tagsIds }] =
    ArticleSlice.useContext();
  const [deleteArticleFromDb] = useDeleteArticleMutation();

  const updateStoreRelatedEntitiesOnDelete =
    useUpdateStoreRelatedEntitiesOnDelete();

  const handleDelete = async () => {
    await deleteArticleFromDb({
      id: articleId,
      subEntities: { authorsIds, collectionsIds, subjectsIds, tagsIds },
    });
    updateStoreRelatedEntitiesOnDelete();
  };

  return handleDelete;
};

export default useDeleteArticle;

import ArticleSlice from "^context/articles/ArticleContext";
import useUpdateSubEntitiesInStoreOnParentDelete from "^hooks/useUpdateSubEntitiesInStoreOnParentDelete";
import { useDeleteArticleMutation } from "^redux/services/articles";

const useDeleteArticle = () => {
  // delete article in db -> updates in store
  // update sub-entities in store
  // update sub-entities in db
  const [{ id: articleId, authorsIds, collectionsIds, subjectsIds, tagsIds }] =
    ArticleSlice.useContext();
  const [deleteArticleFromDb] = useDeleteArticleMutation();

  const props = {
    entityId: articleId,
    authorsIds,
    collectionsIds,
    subjectsIds,
    tagsIds,
  };

  const updateSubEntitiesInStore =
    useUpdateSubEntitiesInStoreOnParentDelete(props);

  const handleDelete = async () => {
    await deleteArticleFromDb({
      ...props,
      useToasts: true,
    });
    updateSubEntitiesInStore();
  };

  return handleDelete;
};

export default useDeleteArticle;

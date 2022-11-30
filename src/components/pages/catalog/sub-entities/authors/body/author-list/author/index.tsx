import { useDispatch } from "^redux/hooks";
import { removeOne as removeAuthor } from "^redux/state/authors";

import AuthorSlice from "^context/authors/AuthorContext";

import useUpdateStoreRelatedEntitiesOnDelete from "^hooks/authors/useUpdateStoreRelatedEntitiesOnDelete";

import { Author as AuthorType } from "^types/author";

import RelatedDocumentsSection from "./related-documents";
import TranslationsSection from "./translations";
import { $Entity } from "^catalog-pages/_presentation";

const Author = ({ author }: { author: AuthorType }) => {
  return (
    <AuthorSlice.Provider author={author}>
      <Content />
    </AuthorSlice.Provider>
  );
};

export default Author;

const Content = () => {
  const [{ id: authorId }] = AuthorSlice.useContext();

  const dispatch = useDispatch();

  const updateStoreRelatedEntitiesOnDelete =
    useUpdateStoreRelatedEntitiesOnDelete();

  const handleDelete = () => {
    dispatch(removeAuthor({ id: authorId }));
    updateStoreRelatedEntitiesOnDelete();
  };

  return (
    <$Entity
      deleteEntity={handleDelete}
      entityName="author"
      relatedDocuments={<RelatedDocumentsSection />}
      entityText={<TranslationsSection />}
    />
  );
};

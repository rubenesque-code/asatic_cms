import tw from "twin.macro";

import { removeOne as removeAuthor } from "^redux/state/authors";

import AuthorSlice from "^context/authors/AuthorContext";
import useUpdateStoreRelatedEntitiesOnDelete from "^hooks/authors/useUpdateStoreRelatedEntitiesOnDelete";
import { Author as AuthorType } from "^types/author";

import Controls from "./Controls";
import RelatedDocumentsSection from "./related-documents";
import Translations from "./translations";
import { useDispatch } from "^redux/hooks";

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
    <div css={[tw`flex`]} className="group">
      <div>
        <Controls deleteEntity={handleDelete} entityName="author" />
      </div>
      <div css={[tw`mr-sm bg-green-50`]}>
        <div css={[tw`w-[3px] h-[25px] bg-green-200`]} />
      </div>
      <div css={[tw`flex-grow`]}>
        <Translations />
        <div css={[tw`mt-md`]}>
          <RelatedDocumentsSection />
        </div>
      </div>
    </div>
  );
};

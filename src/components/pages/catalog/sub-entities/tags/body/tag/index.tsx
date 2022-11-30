import { useDispatch } from "^redux/hooks";
import { removeOne as removeTag } from "^redux/state/tags";

import TagSlice from "^context/tags/TagContext";

import useUpdateStoreRelatedEntitiesOnDelete from "^hooks/tags/useUpdateStoreRelatedEntitiesOnDelete";

import { Tag as TagType } from "^types/tag";

import RelatedDocumentsSection from "./related-documents";
import Text from "./text";
import { $Entity } from "^catalog-pages/_presentation";

const Tag = ({ tag }: { tag: TagType }) => {
  return (
    <TagSlice.Provider tag={tag}>
      <Content />
    </TagSlice.Provider>
  );
};

export default Tag;

const Content = () => {
  const [{ id: tagId }] = TagSlice.useContext();

  const dispatch = useDispatch();

  const updateStoreRelatedEntitiesOnDelete =
    useUpdateStoreRelatedEntitiesOnDelete();

  const handleRemove = () => {
    dispatch(removeTag({ id: tagId }));
    updateStoreRelatedEntitiesOnDelete();
  };

  return (
    <$Entity
      deleteEntity={handleRemove}
      entityName="tag"
      relatedDocuments={<RelatedDocumentsSection />}
      entityText={<Text />}
    />
  );
};

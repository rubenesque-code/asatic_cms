import { useSelector } from "^redux/hooks";
import { selectCollectionsByLanguageAndQuery } from "^redux/state/complex-selectors/collections";

import CollectionSlice from "^context/collections/CollectionContext";

import useUpdateStoreRelatedEntitiesOnDelete from "^hooks/collections/useUpdateStoreRelatedEntitiesOnDelete";

import { orderDisplayContent } from "^helpers/displayContent";

import Table_ from "^components/display-entities-table/Table";
import {
  TitleCell,
  EntitiesPageActionsCell,
  StatusCell,
  SubjectsCell,
  TagsCell,
  LanguageCell,
} from "^components/display-entities-table/Cells";
import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect, {
  allLanguageId,
} from "^components/FilterLanguageSelect";
import { useDeleteCollectionMutation } from "^redux/services/collections";

export default function Table() {
  const { id: languageId } = FilterLanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const filtered = useSelector((state) =>
    selectCollectionsByLanguageAndQuery(state, { languageId, query })
  );
  const ordered = orderDisplayContent(filtered);

  return (
    <Table_
      columns={["Title", "Actions", "Status", "Language", "Subjects", "Tags"]}
      isContent={Boolean(ordered.length)}
      isFilter={isFilter}
    >
      {ordered.map((collection) => (
        <CollectionSlice.Provider collection={collection} key={collection.id}>
          <CollectionTableRow />
        </CollectionSlice.Provider>
      ))}
    </Table_>
  );
}

const CollectionTableRow = () => {
  const [
    {
      id: collectionId,
      status,
      subjectsIds,
      tagsIds,
      publishDate,
      articlesIds,
      blogsIds,
      recordedEventsIds,
      languageId,
      title,
    },
    { routeToEditPage },
  ] = CollectionSlice.useContext();

  // const [deleteFromDb] = useDeleteMutationContext();
  const [deleteFromDb] = useDeleteCollectionMutation();
  const updateStoreRelatedEntitiesOnDelete =
    useUpdateStoreRelatedEntitiesOnDelete();

  const handleDelete = async () => {
    await deleteFromDb({
      id: collectionId,
      subEntities: {
        articlesIds,
        blogsIds,
        recordedEventsIds,
        subjectsIds,
        tagsIds,
      },
      useToasts: true,
    });
    updateStoreRelatedEntitiesOnDelete();
  };

  return (
    <>
      <TitleCell status={status} title={title} />
      <EntitiesPageActionsCell
        deleteEntity={handleDelete}
        entityType="collection"
        routeToEditPage={routeToEditPage}
      />
      <StatusCell status={status} publishDate={publishDate} />
      <LanguageCell languageId={languageId} />
      <SubjectsCell activeLanguageId={languageId} subjectsIds={subjectsIds} />
      <TagsCell tagsIds={tagsIds} />
    </>
  );
};

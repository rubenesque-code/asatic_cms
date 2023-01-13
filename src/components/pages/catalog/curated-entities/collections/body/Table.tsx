import { useSelector } from "^redux/hooks";
import { selectCollectionsByLanguageAndQuery } from "^redux/state/complex-selectors/collections";

import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";

import useUpdateStoreRelatedEntitiesOnDelete from "^hooks/collections/useUpdateStoreRelatedEntitiesOnDelete";
import { useDeleteMutationContext } from "../DeleteMutationContext";

import { orderDisplayContent } from "^helpers/displayContent";

import CollectionProviders from "^components/_containers/collections/ProvidersWithOwnLanguages";
import Table_ from "^components/display-entities-table/Table";
import {
  TitleCell,
  EntitiesPageActionsCell,
  StatusCell,
  SubjectsCell,
  TagsCell,
  LanguagesCell,
} from "^components/display-entities-table/Cells";
import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect, {
  allLanguageId,
} from "^components/FilterLanguageSelect";
import { useEntityLanguageContext } from "^context/EntityLanguages";

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
      columns={[
        "Title",
        "Actions",
        "Status",
        "Subjects",
        "Tags",
        "Translations",
      ]}
      isContent={Boolean(ordered.length)}
      isFilter={isFilter}
    >
      {ordered.map((collection) => (
        <CollectionProviders recordedEvent={collection} key={collection.id}>
          <CollectionTableRow />
        </CollectionProviders>
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
      languagesIds,
      publishDate,
      articlesIds,
      blogsIds,
      recordedEventsIds,
    },
    { routeToEditPage },
  ] = CollectionSlice.useContext();
  const [{ title }] = CollectionTranslationSlice.useContext();
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const [deleteFromDb] = useDeleteMutationContext();
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
      useToasts: false,
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
      <SubjectsCell
        activeLanguageId={activeLanguageId}
        subjectsIds={subjectsIds}
      />
      <TagsCell tagsIds={tagsIds} />
      <LanguagesCell
        activeLanguageId={activeLanguageId}
        languagesIds={languagesIds}
        setActiveLanguageId={updateActiveLanguage}
      />
    </>
  );
};

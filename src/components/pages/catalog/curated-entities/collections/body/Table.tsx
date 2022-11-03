import { useSelector } from "^redux/hooks";
import { selectCollectionsByLanguageAndQuery } from "^redux/state/complex-selectors/collections";

import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";
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
import DocLanguages from "^components/DocLanguages";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import useDeleteCollection from "^hooks/collections/useDeleteCollection";
import { getRelatedEntitiesIds } from "^helpers/collection";

export default function Table() {
  const { id: languageId } = LanguageSelect.useContext();
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
        <CollectionProviders collection={collection} key={collection.id}>
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
      relatedEntities,
    },
    { routeToEditPage },
  ] = CollectionSlice.useContext();
  const [{ title }] = CollectionTranslationSlice.useContext();
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();
  const [deleteFromDb] = useDeleteMutationContext();

  const handleDeleteCollection = useDeleteCollection({
    deleteFromDb,
    entityId: collectionId,
    subjectsIds,
    tagsIds,
    articlesIds: getRelatedEntitiesIds(relatedEntities, "article"),
    blogsIds: getRelatedEntitiesIds(relatedEntities, "blog"),
    recordedEventsIds: getRelatedEntitiesIds(relatedEntities, "recorded-event"),
  });

  return (
    <>
      <TitleCell status={status} title={title} />
      <EntitiesPageActionsCell
        deleteEntity={handleDeleteCollection}
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
        setActiveLanguageId={setActiveLanguageId}
      />
    </>
  );
};

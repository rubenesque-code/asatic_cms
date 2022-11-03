import { useSelector } from "^redux/hooks";
import { selectCollectionsByLanguageAndQuery } from "^redux/state/complex-selectors/collections";

import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

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
import useUpdateSubEntitiesInStoreOnParentDelete from "^hooks/useOnDeleteDisplayEntity";

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
    },
    { routeToEditPage },
  ] = CollectionSlice.useContext();
  const [{ title }] = CollectionTranslationSlice.useContext();
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();
  const [deleteFromDb] = useDeleteMutationContext();

  const onDelete = useUpdateSubEntitiesInStoreOnParentDelete({
    entityId: collectionId,
    subjectsIds,
    tagsIds,
  });

  return (
    <>
      <TitleCell status={status} title={title} />
      <EntitiesPageActionsCell
        deleteEntity={() =>
          deleteFromDb({ id: collectionId, useToasts: true, onDelete })
        }
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

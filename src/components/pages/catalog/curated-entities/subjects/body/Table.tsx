import { useSelector } from "^redux/hooks";
import { selectSubjectsByLanguageAndQuery } from "^redux/state/complex-selectors/subjects";

import SubjectSlice from "^context/subjects/SubjectContext";

import { orderDisplayContent } from "^helpers/displayContent";

import Table_ from "^components/display-entities-table/Table";
import {
  TitleCell,
  EntitiesPageActionsCell,
  StatusCell,
  TagsCell,
  LanguageCell,
} from "^components/display-entities-table/Cells";
import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect, {
  allLanguageId,
} from "^components/FilterLanguageSelect";

import useUpdateStoreRelatedEntitiesOnDelete from "^hooks/subjects/useUpdateStoreRelatedEntitiesOnDelete";
import { useDeleteSubjectMutation } from "^redux/services/subjects";

export default function Table() {
  const { id: languageId } = FilterLanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const filtered = useSelector((state) =>
    selectSubjectsByLanguageAndQuery(state, { languageId, query })
  );
  const ordered = orderDisplayContent(filtered);

  return (
    <Table_
      columns={["Title", "Actions", "Status", "Language", "Tags"]}
      isContent={Boolean(ordered.length)}
      isFilter={isFilter}
    >
      {ordered.map((collection) => (
        <SubjectSlice.Provider subject={collection} key={collection.id}>
          <SubjectTableRow />
        </SubjectSlice.Provider>
      ))}
    </Table_>
  );
}

const SubjectTableRow = () => {
  const [
    {
      id,
      status,
      tagsIds,
      publishDate,
      articlesIds,
      blogsIds,
      collectionsIds,
      recordedEventsIds,
      languageId,
      title,
    },
    { routeToEditPage },
  ] = SubjectSlice.useContext();

  const [deleteFromDb] = useDeleteSubjectMutation();
  const updateStoreRelatedEntitiesOnDelete =
    useUpdateStoreRelatedEntitiesOnDelete();

  const handleDelete = async () => {
    await deleteFromDb({
      id,
      subEntities: {
        articlesIds,
        blogsIds,
        collectionsIds,
        recordedEventsIds,
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
        entityType="subject"
        routeToEditPage={routeToEditPage}
      />
      <StatusCell status={status} publishDate={publishDate} />
      <LanguageCell languageId={languageId} />
      <TagsCell tagsIds={tagsIds} />
    </>
  );
};

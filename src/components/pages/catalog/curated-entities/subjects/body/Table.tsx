import { useSelector } from "^redux/hooks";
import { selectSubjectsByLanguageAndQuery } from "^redux/state/complex-selectors/subjects";

import SubjectSlice from "^context/subjects/SubjectContext";
import SubjectTranslationSlice from "^context/subjects/SubjectTranslationContext";

import { orderDisplayContent } from "^helpers/displayContent";

import SubjectProviders from "^components/_containers/subjects/ProvidersWithOwnLanguages";
import Table_ from "^components/display-entities-table/Table";
import {
  TitleCell,
  EntitiesPageActionsCell,
  StatusCell,
  TagsCell,
  LanguagesCell,
} from "^components/display-entities-table/Cells";
import DocsQuery from "^components/DocsQuery";
import FilterLanguageSelect, {
  allLanguageId,
} from "^components/FilterLanguageSelect";
import { useEntityLanguageContext } from "^context/EntityLanguages";

import { useDeleteMutationContext } from "../DeleteMutationContext";
import useUpdateStoreRelatedEntitiesOnDelete from "^hooks/subjects/useUpdateStoreRelatedEntitiesOnDelete";

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
      columns={["Title", "Actions", "Status", "Tags", "Translations"]}
      isContent={Boolean(ordered.length)}
      isFilter={isFilter}
    >
      {ordered.map((collection) => (
        <SubjectProviders subject={collection} key={collection.id}>
          <SubjectTableRow />
        </SubjectProviders>
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
      languagesIds,
      publishDate,
      articlesIds,
      blogsIds,
      collectionsIds,
      recordedEventsIds,
    },
    { routeToEditPage },
  ] = SubjectSlice.useContext();
  const [{ title }] = SubjectTranslationSlice.useContext();
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const [deleteFromDb] = useDeleteMutationContext();
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
      <TagsCell tagsIds={tagsIds} />
      <LanguagesCell
        activeLanguageId={activeLanguageId}
        languagesIds={languagesIds}
        setActiveLanguageId={updateActiveLanguage}
      />
    </>
  );
};

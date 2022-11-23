import { useSelector } from "^redux/hooks";
import { selectRecordedEventsByLanguageAndQuery } from "^redux/state/complex-selectors/recorded-events";

import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";

import { orderDisplayContent } from "^helpers/displayContent";

import RecordedEventProviders from "^components/_containers/recorded-events/ProvidersWithOwnLanguages";
import Table_ from "^components/display-entities-table/Table";
import {
  TitleCell,
  EntitiesPageActionsCell,
  StatusCell,
  AuthorsCell,
  SubjectsCell,
  CollectionsCell,
  TagsCell,
  LanguagesCell,
  RecordedEventTypeCell,
} from "^components/display-entities-table/Cells";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import useDeleteRecordedEvent from "^hooks/recorded-events/useDeleteRecordedEvent";
import { useEntityLanguageContext } from "^context/EntityLanguages";

export default function Table() {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const filtered = useSelector((state) =>
    selectRecordedEventsByLanguageAndQuery(state, { languageId, query })
  );
  const ordered = orderDisplayContent(filtered);

  return (
    <Table_
      columns={[
        "Title",
        "Actions",
        "Status",
        "Type",
        "Authors",
        "Subjects",
        "Collections",
        "Tags",
        "Translations",
      ]}
      isContent={Boolean(ordered.length)}
      isFilter={isFilter}
    >
      {ordered.map((recordedEvent) => (
        <RecordedEventProviders
          recordedEvent={recordedEvent}
          key={recordedEvent.id}
        >
          <RecordedEventTableRow />
        </RecordedEventProviders>
      ))}
    </Table_>
  );
}

const RecordedEventTableRow = () => {
  const [
    {
      status,
      subjectsIds,
      tagsIds,
      languagesIds,
      publishDate,
      authorsIds,
      collectionsIds,
    },
    { routeToEditPage },
  ] = RecordedEventSlice.useContext();
  const [{ title }] = RecordedEventTranslationSlice.useContext();
  const { activeLanguageId, updateActiveLanguage } = useEntityLanguageContext();

  const handleDeleteRecordedEvent = useDeleteRecordedEvent();

  return (
    <>
      <TitleCell status={status} title={title} />
      <EntitiesPageActionsCell
        deleteEntity={handleDeleteRecordedEvent}
        entityType="video document"
        routeToEditPage={routeToEditPage}
      />
      <StatusCell status={status} publishDate={publishDate} />
      <RecordedEventTypeCell />
      <AuthorsCell
        authorsIds={authorsIds}
        activeLanguageId={activeLanguageId}
      />
      <SubjectsCell
        activeLanguageId={activeLanguageId}
        subjectsIds={subjectsIds}
      />
      <CollectionsCell
        collectionsIds={collectionsIds}
        activeLanguageId={activeLanguageId}
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

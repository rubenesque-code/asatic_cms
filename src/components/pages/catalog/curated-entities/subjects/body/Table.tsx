import { useSelector } from "^redux/hooks";
import {} from "^redux/state/complex-selectors/subjects";

import SubjectSlice from "^context/collections/CollectionContext";
import SubjectTranslationSlice from "^context/collections/CollectionTranslationContext";

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
import DocLanguages from "^components/DocLanguages";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import useDeleteSubject from "^hooks/subjects/useDeleteSubject";

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
      columns={["Title", "Actions", "Status", "Tags", "Translations"]}
      isContent={Boolean(ordered.length)}
      isFilter={isFilter}
    >
      {ordered.map((collection) => (
        <SubjectProviders subject={collection} key={collection.id}>
          <CollectionTableRow />
        </SubjectProviders>
      ))}
    </Table_>
  );
}

const CollectionTableRow = () => {
  const [{ status, tagsIds, languagesIds, publishDate }, { routeToEditPage }] =
    SubjectSlice.useContext();
  const [{ title }] = SubjectTranslationSlice.useContext();
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();

  const handleDeleteSubject = useDeleteSubject();

  return (
    <>
      <TitleCell status={status} title={title} />
      <EntitiesPageActionsCell
        deleteEntity={handleDeleteSubject}
        entityType="subject"
        routeToEditPage={routeToEditPage}
      />
      <StatusCell status={status} publishDate={publishDate} />
      <TagsCell tagsIds={tagsIds} />
      <LanguagesCell
        activeLanguageId={activeLanguageId}
        languagesIds={languagesIds}
        setActiveLanguageId={setActiveLanguageId}
      />
    </>
  );
};

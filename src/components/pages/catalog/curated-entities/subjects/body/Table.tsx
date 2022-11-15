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
import DocLanguages from "^components/DocLanguages";
import DocsQuery from "^components/DocsQuery";
import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import useDeleteSubject from "^hooks/subjects/useDeleteSubject";

export default function Table() {
  const { id: languageId } = LanguageSelect.useContext();
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
  const [{ status, tagsIds, languagesIds, publishDate }, { routeToEditPage }] =
    SubjectSlice.useContext();
  const [{ name }] = SubjectTranslationSlice.useContext();
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();

  const handleDeleteSubject = useDeleteSubject();

  return (
    <>
      <TitleCell status={status} title={name} />
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
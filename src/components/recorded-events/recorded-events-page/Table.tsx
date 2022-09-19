import { ReactElement } from "react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";
import { selectRecordedEventsByLanguageAndQuery } from "^redux/state/complex-selectors/recorded-events";

import RecordedEventsSlice from "^context/recorded-events/RecordedEventContext";
import RecordedEventTranslationSlice from "^context/recorded-events/RecordedEventTranslationContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import { RecordedEvent as RecordedEventType } from "^types/recordedEvent";

import TableUI, {
  s_table,
} from "^components/display-content-items-page/table/TableUI";
import DocLanguages from "^components/DocLanguages";
import DocsQuery from "^components/DocsQuery";
import HandleDocAuthor from "^components/handle-doc-sub-doc/Authors";
import HandleDocCollection from "^components/handle-doc-sub-doc/Collection";
import HandleDocLanguage from "^components/handle-doc-sub-doc/Language";
import ListDocSubDocItemsUI from "^components/handle-doc-sub-doc/ListItemsUI";
import HandleDocSubject from "^components/handle-doc-sub-doc/Subject";
import HandleDocTag from "^components/handle-doc-sub-doc/Tag";
import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import MissingText from "^components/MissingText";
import WithTooltip from "^components/WithTooltip";

export default function Table() {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const recordedEventsFiltered = useSelector((state) =>
    selectRecordedEventsByLanguageAndQuery(state, { languageId, query })
  );

  return (
    <TableUI isFilter={isFilter} optionalColumns={["authors", "collections"]}>
      {recordedEventsFiltered.map((recordedEvent) => (
        <RecordedEventProviders
          recordedEvent={recordedEvent}
          key={recordedEvent.id}
        >
          <RowCells />
        </RecordedEventProviders>
      ))}
    </TableUI>
  );
}

const RecordedEventProviders = ({
  recordedEvent,
  children,
}: {
  recordedEvent: RecordedEventType;
  children: ReactElement;
}) => {
  return (
    <RecordedEventsSlice.Provider recordedEvent={recordedEvent}>
      {([{ id: recordedEventId, languagesIds, translations }]) => (
        <DocLanguages.Provider docLanguagesIds={languagesIds}>
          {({ activeLanguageId }) => (
            <RecordedEventTranslationSlice.Provider
              recordedEventId={recordedEventId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </RecordedEventTranslationSlice.Provider>
          )}
        </DocLanguages.Provider>
      )}
    </RecordedEventsSlice.Provider>
  );
};

const RowCells = () => {
  return (
    <>
      <TitleCell />
      <ActionsCell />
      <StatusCell />
      <AuthorsCell />
      <SubjectsCell />
      <CollectionsCell />
      <TagsCell />
      <LanguagesCell />
    </>
  );
};

const TitleCell = () => {
  const [{ status }] = RecordedEventsSlice.useContext();
  const [{ title }] = RecordedEventTranslationSlice.useContext();

  return (
    <TableUI.Cell>
      {title ? (
        title
      ) : status === "new" ? (
        "-"
      ) : (
        <MissingText tooltipText="missing title for translation" />
      )}
    </TableUI.Cell>
  );
};

const ActionsCell = () => {
  const [{ id }, { routeToEditPage }] = RecordedEventsSlice.useContext();
  const [deleteFromDb] = useDeleteMutationContext();

  return (
    <TableUI.ActionsCell
      deleteDoc={() => deleteFromDb({ id, useToasts: true })}
      docType="recorded event"
      routeToEditPage={routeToEditPage}
    />
  );
};

const StatusCell = () => {
  const [{ publishDate, status }] = RecordedEventsSlice.useContext();

  return <TableUI.StatusCell publishDate={publishDate} status={status} />;
};

const AuthorsCell = () => {
  const [{ authorsIds }] = RecordedEventsSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <TableUI.Cell>
      {authorsIds.length ? (
        <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
          {authorsIds.map((authorId) => (
            <HandleDocAuthor
              docActiveLanguageId={activeLanguageId}
              authorId={authorId}
              key={authorId}
            />
          ))}
        </ListDocSubDocItemsUI>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const SubjectsCell = () => {
  const [{ subjectsIds }] = RecordedEventsSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <TableUI.Cell>
      {subjectsIds.length ? (
        <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
          {subjectsIds.map((subjectId) => (
            <HandleDocSubject
              docActiveLanguageId={activeLanguageId}
              subjectId={subjectId}
              key={subjectId}
            />
          ))}
        </ListDocSubDocItemsUI>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const CollectionsCell = () => {
  const [{ collectionsIds }] = RecordedEventsSlice.useContext();
  const [{ activeLanguageId }] = DocLanguages.useContext();

  return (
    <TableUI.Cell>
      {collectionsIds.length ? (
        <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
          {collectionsIds.map((collectionId) => (
            <HandleDocCollection
              docActiveLanguageId={activeLanguageId}
              collectionId={collectionId}
              key={collectionId}
            />
          ))}
        </ListDocSubDocItemsUI>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const TagsCell = () => {
  const [{ tagsIds }] = RecordedEventsSlice.useContext();

  return (
    <TableUI.Cell>
      {tagsIds.length ? (
        <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
          {tagsIds.map((tagId) => (
            <HandleDocTag tagId={tagId} key={tagId} />
          ))}
        </ListDocSubDocItemsUI>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const LanguagesCell = () => {
  const [{ languagesIds }] = RecordedEventsSlice.useContext();

  return (
    <TableUI.Cell>
      {languagesIds.length ? (
        <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
          {languagesIds.map((languageId) => (
            <Language languageId={languageId} key={languageId} />
          ))}
        </ListDocSubDocItemsUI>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const Language = ({ languageId }: { languageId: string }) => {
  const [{ activeLanguageId }, { setActiveLanguageId }] =
    DocLanguages.useContext();

  const isSelected = languageId === activeLanguageId;

  return (
    <WithTooltip
      text="click to show this translation"
      isDisabled={isSelected}
      type="action"
    >
      <button
        css={[isSelected && tw`border-b-2 border-green-active`]}
        onClick={() => setActiveLanguageId(languageId)}
        type="button"
      >
        <HandleDocLanguage languageId={languageId} />
      </button>
    </WithTooltip>
  );
};

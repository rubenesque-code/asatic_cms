import { ReactElement } from "react";
import tw from "twin.macro";

import { useSelector } from "^redux/hooks";

import CollectionSlice from "^context/collections/CollectionContext";
import CollectionTranslationSlice from "^context/collections/CollectionTranslationContext";
import { useDeleteMutationContext } from "^context/DeleteMutationContext";

import TableUI, {
  s_table,
} from "^components/display-content-items-page/table/TableUI";
import DocLanguages from "^components/DocLanguages";
import DocsQuery from "^components/DocsQuery";
import HandleDocLanguage from "^components/handle-doc-sub-doc/Language";
import ListDocSubDocItemsUI from "^components/handle-doc-sub-doc/ListItemsUI";
import HandleDocSubject from "^components/handle-doc-sub-doc/Subject";
import HandleDocTag from "^components/handle-doc-sub-doc/Tag";
import LanguageSelect, { allLanguageId } from "^components/LanguageSelect";
import MissingText from "^components/MissingText";
import WithTooltip from "^components/WithTooltip";
import { selectCollectionsByLanguageAndQuery } from "^redux/state/complex-selectors/collections";
import { Collection as CollectionType } from "^types/collection";

export default function Table() {
  const { id: languageId } = LanguageSelect.useContext();
  const query = DocsQuery.useContext();

  const isFilter = Boolean(languageId !== allLanguageId || query.length);

  const collectionsFiltered = useSelector((state) =>
    selectCollectionsByLanguageAndQuery(state, { languageId, query })
  );

  return (
    <TableUI isFilter={isFilter} optionalColumns={["actions"]}>
      {collectionsFiltered.map((collection) => (
        <CollectionProviders collection={collection} key={collection.id}>
          <RowCells />
        </CollectionProviders>
      ))}
    </TableUI>
  );
}

const CollectionProviders = ({
  collection,
  children,
}: {
  collection: CollectionType;
  children: ReactElement;
}) => {
  return (
    <CollectionSlice.Provider collection={collection}>
      {([{ id: collectionId, languagesIds, translations }]) => (
        <DocLanguages.Provider docLanguagesIds={languagesIds}>
          {({ activeLanguageId }) => (
            <CollectionTranslationSlice.Provider
              collectionId={collectionId}
              translation={
                translations.find((t) => t.languageId === activeLanguageId)!
              }
            >
              {children}
            </CollectionTranslationSlice.Provider>
          )}
        </DocLanguages.Provider>
      )}
    </CollectionSlice.Provider>
  );
};

const RowCells = () => {
  return (
    <>
      <TitleCell />
      <ActionsCell />
      <StatusCell />
      <SubjectsCell />
      <TagsCell />
      <LanguagesCell />
    </>
  );
};

const TitleCell = () => {
  const [{ status }] = CollectionSlice.useContext();
  const [{ title }] = CollectionTranslationSlice.useContext();

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
  const [{ id }, { routeToEditPage }] = CollectionSlice.useContext();
  const [deleteFromDb] = useDeleteMutationContext();

  return (
    <TableUI.ActionsCell
      deleteDoc={() => deleteFromDb({ id, useToasts: true })}
      docType="collection"
      routeToEditPage={routeToEditPage}
    />
  );
};

const StatusCell = () => {
  const [{ publishDate, status }] = CollectionSlice.useContext();

  return <TableUI.StatusCell publishDate={publishDate} status={status} />;
};

const SubjectsCell = () => {
  const [{ subjectsIds }] = CollectionSlice.useContext();
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

const TagsCell = () => {
  const [{ tagsIds }] = CollectionSlice.useContext();

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
  const [{ languagesIds }] = CollectionSlice.useContext();

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

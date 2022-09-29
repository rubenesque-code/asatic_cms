import tw from "twin.macro";

import HandleDocAuthor from "^components/handle-doc-sub-doc/Authors";
import HandleDocCollection from "^components/handle-doc-sub-doc/Collection";
import HandleDocLanguage from "^components/handle-doc-sub-doc/Language";
import ListDocSubDocItemsUI from "^components/handle-doc-sub-doc/ListItemsUI";
import HandleDocSubject from "^components/handle-doc-sub-doc/Subject";
import HandleDocTag from "^components/handle-doc-sub-doc/Tag";
import MissingText from "^components/MissingText";
import WithTooltip from "^components/WithTooltip";
import useCreateAuthorsDisplayString from "^hooks/authors/useCreateDisplayString";
import useCreateCollectionsDisplayString from "^hooks/collections/useCreateDisplayString";
import useCreateSubjectsDisplayString from "^hooks/subjects/useCreateDisplayString";
import useCreateTagsDisplayString from "^hooks/tags/useCreateDisplayString";
import useCreateLanguagesDisplayString from "^hooks/translationLanguages/useCreateDisplayString";
import { DisplayContentStatus } from "^types/display-content";
import TableUI, { s_table } from "./TableUI";

export const TitleCell = ({
  status,
  title,
}: {
  status: DisplayContentStatus;
  title: string | undefined;
}) => {
  return (
    <TableUI.Cell>
      {title ? (
        <TableUI.TruncateString styles={tw`w-full`}>
          {title}
        </TableUI.TruncateString>
      ) : status === "new" ? (
        "-"
      ) : (
        <MissingText tooltipText="missing title for translation" />
      )}
    </TableUI.Cell>
  );
};

export const StatusCell = ({
  publishDate,
  status,
}: {
  publishDate: Date | undefined;
  status: DisplayContentStatus;
}) => {
  return <TableUI.StatusCell publishDate={publishDate} status={status} />;
};

export const AuthorsCell = ({
  activeLanguageId,
  authorsIds,
}: {
  activeLanguageId: string;
  authorsIds: string[];
}) => {
  const authorsStr = useCreateAuthorsDisplayString({
    activeLanguageId,
    authorsIds,
  });

  return (
    <TableUI.Cell>
      {authorsIds.length ? (
        <TableUI.TruncateEntities entitiesStr={authorsStr}>
          <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
            {authorsIds.map((authorId) => (
              <HandleDocAuthor
                docActiveLanguageId={activeLanguageId}
                authorId={authorId}
                key={authorId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TableUI.TruncateEntities>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

export const SubjectsCell = ({
  activeLanguageId,
  subjectsIds,
}: {
  activeLanguageId: string;
  subjectsIds: string[];
}) => {
  const subjectsStr = useCreateSubjectsDisplayString({
    activeLanguageId,
    subjectsIds,
  });

  return (
    <TableUI.Cell>
      {subjectsIds.length ? (
        <TableUI.TruncateEntities entitiesStr={subjectsStr}>
          <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
            {subjectsIds.map((subjectId) => (
              <HandleDocSubject
                docActiveLanguageId={activeLanguageId}
                subjectId={subjectId}
                key={subjectId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TableUI.TruncateEntities>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

export const CollectionsCell = ({
  activeLanguageId,
  collectionsIds,
}: {
  activeLanguageId: string;
  collectionsIds: string[];
}) => {
  const collectionsStr = useCreateCollectionsDisplayString({
    activeLanguageId,
    collectionsIds,
  });

  return (
    <TableUI.Cell>
      {collectionsIds.length ? (
        <TableUI.TruncateEntities entitiesStr={collectionsStr}>
          <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
            {collectionsIds.map((collectionId) => (
              <HandleDocCollection
                docActiveLanguageId={activeLanguageId}
                collectionId={collectionId}
                key={collectionId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TableUI.TruncateEntities>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

export const TagsCell = ({ tagsIds }: { tagsIds: string[] }) => {
  const tagsStr = useCreateTagsDisplayString({ tagsIds });

  return (
    <TableUI.Cell>
      {tagsIds.length ? (
        <TableUI.TruncateEntities entitiesStr={tagsStr}>
          <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
            {tagsIds.map((tagId) => (
              <HandleDocTag tagId={tagId} key={tagId} />
            ))}
          </ListDocSubDocItemsUI>
        </TableUI.TruncateEntities>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

export const LanguagesCell = ({
  languagesIds,
  activeLanguageId,
  setActiveLanguageId,
}: {
  activeLanguageId: string;
  languagesIds: string[];
  setActiveLanguageId: (languageId: string) => void;
}) => {
  const languagesStr = useCreateLanguagesDisplayString({ languagesIds });

  return (
    <TableUI.Cell>
      {languagesIds.length ? (
        <TableUI.TruncateEntities entitiesStr={languagesStr}>
          <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
            {languagesIds.map((languageId) => (
              <Language
                activeLanguageId={activeLanguageId}
                languageId={languageId}
                setActiveLanguageId={setActiveLanguageId}
                key={languageId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TableUI.TruncateEntities>
      ) : (
        "-"
      )}
    </TableUI.Cell>
  );
};

const Language = ({
  languageId,
  activeLanguageId,
  setActiveLanguageId,
}: {
  activeLanguageId: string;
  languageId: string;
  setActiveLanguageId: (languageId: string) => void;
}) => {
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

import tw from "twin.macro";

import HandleDocAuthor from "^components/handle-doc-sub-doc/Authors";
import HandleDocLanguage from "^components/handle-doc-sub-doc/Language";
import ListDocSubDocItemsUI from "^components/handle-doc-sub-doc/ListItemsUI";
import HandleDocTag from "^components/handle-doc-sub-doc/Tag";
import MissingText from "^components/MissingText";
import WithTooltip from "^components/WithTooltip";
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
        title
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

export const TagsCell = ({ tagsIds }: { tagsIds: string[] }) => {
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

export const LanguagesCell = ({
  languagesIds,
  activeLanguageId,
  setActiveLanguageId,
}: {
  activeLanguageId: string;
  languagesIds: string[];
  setActiveLanguageId: (languageId: string) => void;
}) => {
  return (
    <TableUI.Cell>
      {languagesIds.length ? (
        <ListDocSubDocItemsUI containerStyles={s_table.cellSubDocsList}>
          {languagesIds.map((languageId) => (
            <Language
              activeLanguageId={activeLanguageId}
              setActiveLanguageId={setActiveLanguageId}
              languageId={languageId}
              key={languageId}
            />
          ))}
        </ListDocSubDocItemsUI>
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

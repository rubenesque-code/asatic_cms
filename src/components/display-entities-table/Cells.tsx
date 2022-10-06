import { ReactElement } from "react";
import { Info } from "phosphor-react";
import tw, { TwStyle } from "twin.macro";

import useCreateAuthorsDisplayString from "^hooks/authors/useCreateDisplayString";
import useCreateCollectionsDisplayString from "^hooks/collections/useCreateDisplayString";
import useCreateSubjectsDisplayString from "^hooks/subjects/useCreateDisplayString";
import useCreateTagsDisplayString from "^hooks/tags/useCreateDisplayString";
import useCreateLanguagesDisplayString from "^hooks/translationLanguages/useCreateDisplayString";

import { formatDateTimeAgo } from "^helpers/general";

import { DisplayEntityStatus as DisplayEntityStatus_ } from "^types/display-entity";
import { PrimaryEntityError } from "^types/primary-entity";
import { CollectionError } from "^types/collection";

import HandleDocAuthor from "^components/handle-doc-sub-doc/Authors";
import HandleDocCollection from "^components/handle-doc-sub-doc/Collection";
import HandleDocLanguage from "^components/handle-doc-sub-doc/Language";
import ListDocSubDocItemsUI from "^components/handle-doc-sub-doc/ListItemsUI";
import HandleDocSubject from "^components/handle-doc-sub-doc/Subject";
import HandleDocTag from "^components/handle-doc-sub-doc/Tag";
import MissingText from "^components/MissingText";
import WithTooltip from "^components/WithTooltip";

import { $Cell, $StatusLabel, $itemsList } from "./styles";

const TruncateString = ({
  children,
  styles,
}: {
  children: string;
  styles?: TwStyle;
}) => {
  return (
    <WithTooltip text={children}>
      <span css={[tw`max-w-full truncate`, styles]}>{children}</span>
    </WithTooltip>
  );
};

// todo: truncate does anytihng with ReactElements?
function TruncateEntities({
  children,
  entitiesStr,
}: {
  children: ReactElement;
  entitiesStr: string;
}) {
  return (
    <WithTooltip text={entitiesStr}>
      <div css={[tw`max-w-full truncate`]}>{children}</div>
    </WithTooltip>
  );
}

type DisplayEntityStatus = DisplayEntityStatus_<
  PrimaryEntityError | CollectionError
>;

export const TitleCell = ({
  status,
  title,
}: {
  status: DisplayEntityStatus;
  title: string | undefined;
}) => {
  return (
    <$Cell>
      {title ? (
        <TruncateString styles={tw`w-full`}>{title}</TruncateString>
      ) : status === "new" ? (
        "-"
      ) : (
        <MissingText tooltipText="missing title for translation" />
      )}
    </$Cell>
  );
};

export function StatusCell({
  publishDate,
  status,
}: {
  publishDate: Date | undefined;
  status: DisplayEntityStatus;
}) {
  return (
    <$Cell>
      {status === "new" ? (
        <$StatusLabel tw={"bg-blue-200 text-blue-500"}>new</$StatusLabel>
      ) : status === "draft" ? (
        <$StatusLabel tw={"bg-gray-200 text-gray-500"}>draft</$StatusLabel>
      ) : status === "invalid" ? (
        <StatusInvalid />
      ) : typeof status === "object" && status.status === "error" ? (
        <StatusError docErrors={status.errors} />
      ) : (
        <StatusGood publishDate={publishDate!} />
      )}
    </$Cell>
  );
}

function StatusGood({ publishDate }: { publishDate: Date }) {
  return (
    <$StatusLabel tw={"bg-green-200 text-green-500"}>
      <>Published {formatDateTimeAgo(publishDate)}</>
    </$StatusLabel>
  );
}

function StatusInvalid() {
  return (
    <$StatusLabel tw={"bg-red-200 text-red-500 flex items-center gap-xxs"}>
      invalid
      <span css={[tw`text-gray-500`]}>
        <WithTooltip
          text={{
            header: "Invalid Document",
            body: `This document is published but has no valid translation. It won't be shown on the website.`,
          }}
        >
          <Info />
        </WithTooltip>
      </span>
    </$StatusLabel>
  );
}

function StatusError({
  docErrors,
}: {
  docErrors: (PrimaryEntityError | CollectionError)[];
}) {
  return (
    <$StatusLabel
      tw={"bg-orange-200 text-orange-500 flex items-center gap-xxs"}
    >
      errors
      <span css={[tw`text-gray-500`]}>
        <WithTooltip
          text={{
            header: "Document errors",
            body: `This document is published but has errors. It's still valid and will be shown on the website. Errors: ${docErrors.join(
              ", "
            )}`,
          }}
        >
          <Info />
        </WithTooltip>
      </span>
    </$StatusLabel>
  );
}

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
    <$Cell>
      {authorsIds.length ? (
        <TruncateEntities entitiesStr={authorsStr}>
          <ListDocSubDocItemsUI containerStyles={$itemsList}>
            {authorsIds.map((authorId) => (
              <HandleDocAuthor
                docActiveLanguageId={activeLanguageId}
                authorId={authorId}
                key={authorId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TruncateEntities>
      ) : (
        "-"
      )}
    </$Cell>
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
    <$Cell>
      {subjectsIds.length ? (
        <TruncateEntities entitiesStr={subjectsStr}>
          <ListDocSubDocItemsUI containerStyles={$itemsList}>
            {subjectsIds.map((subjectId) => (
              <HandleDocSubject
                docActiveLanguageId={activeLanguageId}
                subjectId={subjectId}
                key={subjectId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TruncateEntities>
      ) : (
        "-"
      )}
    </$Cell>
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
    <$Cell>
      {collectionsIds.length ? (
        <TruncateEntities entitiesStr={collectionsStr}>
          <ListDocSubDocItemsUI containerStyles={$itemsList}>
            {collectionsIds.map((collectionId) => (
              <HandleDocCollection
                docActiveLanguageId={activeLanguageId}
                collectionId={collectionId}
                key={collectionId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TruncateEntities>
      ) : (
        "-"
      )}
    </$Cell>
  );
};

export const TagsCell = ({ tagsIds }: { tagsIds: string[] }) => {
  const tagsStr = useCreateTagsDisplayString({ tagsIds });

  return (
    <$Cell>
      {tagsIds.length ? (
        <TruncateEntities entitiesStr={tagsStr}>
          <ListDocSubDocItemsUI containerStyles={$itemsList}>
            {tagsIds.map((tagId) => (
              <HandleDocTag tagId={tagId} key={tagId} />
            ))}
          </ListDocSubDocItemsUI>
        </TruncateEntities>
      ) : (
        "-"
      )}
    </$Cell>
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
    <$Cell>
      {languagesIds.length ? (
        <TruncateEntities entitiesStr={languagesStr}>
          <ListDocSubDocItemsUI containerStyles={$itemsList}>
            {languagesIds.map((languageId) => (
              <Language
                activeLanguageId={activeLanguageId}
                languageId={languageId}
                setActiveLanguageId={setActiveLanguageId}
                key={languageId}
              />
            ))}
          </ListDocSubDocItemsUI>
        </TruncateEntities>
      ) : (
        "-"
      )}
    </$Cell>
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

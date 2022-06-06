import { ReactElement } from "react";
import { Popover } from "@headlessui/react";
import tw from "twin.macro";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addTranslation,
  removeTranslation,
  selectEntitiesByIds,
  updateName,
  addOne,
  selectIds,
  selectById,
} from "^redux/state/authors";
import { selectById as selectLanguageById } from "^redux/state/languages";

import WithTooltip from "./WithTooltip";
import { Author } from "^types/author";
import InlineTextEditor from "./editors/Inline";
import { FilePlus, Trash, WarningCircle, XCircle } from "phosphor-react";
import WithWarning from "./WithWarning";
import AddTranslation from "./AddTranslation";
import s_button from "^styles/button";
import TextFormInput from "./TextFormInput";
import { DEFAULTLANGUAGEID } from "^constants/data";

type PassedProps = {
  addAuthorToDoc: (authorId: string) => void;
  authorIds: string[];
  docType: string;
  removeAuthorFromDoc: (authorId: string) => void;
};

const WithAddAuthor = ({
  children,
  ...passedProps
}: { children: ReactElement } & PassedProps) => {
  return (
    <Popover css={[tw`z-40 relative`]}>
      {({ open }) => (
        <>
          <WithTooltip text="click to edit author" isDisabled={open}>
            <Popover.Button>{children}</Popover.Button>
          </WithTooltip>
          <Popover.Panel css={[s_panelShell]}>
            <Panel {...passedProps} />
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
};

const s_panelShell = tw`bg-white absolute origin-top bottom-0 translate-y-full shadow-lg rounded-md`;

export default WithAddAuthor;

const Panel = (passedProps: PassedProps) => {
  return (
    <div css={[s_panelContent.container]}>
      <h4 css={[s_panelContent.title]}>Authors</h4>
      <DocAuthors {...passedProps} />
      <ExistingAuthors {...passedProps} />
      <AddNewAuthor />
    </div>
  );
};

const s_panelContent = {
  container: tw`p-lg min-w-[35ch] flex flex-col gap-md`,
  title: tw`text-xl font-medium`,
  section: {
    container: tw`flex flex-col gap-sm items-start`,
    title: tw`font-medium text-lg`,
  },
};

const DocAuthors = ({
  authorIds,
  docType,
  removeAuthorFromDoc,
}: PassedProps) => {
  const authors = useSelector((state) => selectEntitiesByIds(state, authorIds));

  const isAuthor = authors.length;

  return (
    <div css={[s_panelContent.section.container]}>
      <h4 css={[s_panelContent.section.title]}>
        Current Author{authors.length > 1 ? "s" : ""}
      </h4>
      <div css={[s_currentAuthors.container]}>
        {isAuthor ? (
          authors.map((author) => (
            <div css={[s_currentAuthors.authorContainer]} key={author.id}>
              <RemoveDocAuthor
                docType={docType}
                removeAuthorFromDoc={() => removeAuthorFromDoc(author.id)}
              />
              <AuthorTranslations author={author} />
            </div>
          ))
        ) : (
          <p>- None yet -</p>
        )}
      </div>
    </div>
  );
};

const s_currentAuthors = {
  container: tw`flex flex-col gap-sm`,
  authorContainer: tw`flex flex-row w-full gap-sm items-center`,
};

const RemoveDocAuthor = ({
  docType,
  removeAuthorFromDoc,
}: {
  docType: string;
  removeAuthorFromDoc: () => void;
}) => {
  return (
    <WithWarning
      callbackToConfirm={removeAuthorFromDoc}
      warningText={{ heading: `Remove author from ${docType}?` }}
    >
      {({ isOpen: warningIsOpen }) => (
        <WithTooltip
          text={`remove author from ${docType}`}
          isDisabled={warningIsOpen}
        >
          <button
            css={[
              tw`p-xxs hover:bg-gray-100 active:bg-gray-200 rounded-full grid place-items-center`,
            ]}
            type="button"
          >
            <XCircle />
          </button>
        </WithTooltip>
      )}
    </WithWarning>
  );
};

const AuthorTranslations = ({ author }: { author: Author }) => {
  return (
    <div css={[s_authorTranslations]}>
      {author.translations.map((translation) => (
        <AuthorTranslation
          authorId={author.id}
          canDelete={Boolean(author.translations.length > 1)}
          translation={translation}
          key={translation.id}
        />
      ))}
      <AddAuthorTranslation author={author} />
    </div>
  );
};

const s_authorTranslations = tw`flex gap-sm items-center text-base font-normal`;

const AuthorTranslation = ({
  authorId,
  canDelete,
  translation,
}: {
  authorId: string;
  canDelete: boolean;
  translation: Author["translations"][number];
}) => {
  const dispatch = useDispatch();

  const language = useSelector((state) =>
    selectLanguageById(state, translation.languageId)
  );
  const noLanguageErrStr = "error";
  const languageStr = language ? language.name : noLanguageErrStr;

  return (
    <div css={[s_authorTranslation.container]} className="group">
      <WithTooltip text="click to edit author translation">
        <div css={[s_authorTranslation.authorName]}>
          <InlineTextEditor
            initialValue={translation.name}
            onUpdate={(name) => {
              const isValid = name.length;
              if (!isValid) {
                return;
              }
              dispatch(
                updateName({
                  id: authorId,
                  name,
                  translationId: translation.id,
                })
              );
            }}
            placeholder="name"
            // disabled={canEditName}
          />
          <span css={[s_authorTranslation.language]}>
            {languageStr}
            {!language ? (
              <WithTooltip text="Language error. Possibly doesn't exist. Try refreshing the page">
                <span css={[tw`text-red-warning`]}>
                  <WarningCircle />
                </span>
              </WithTooltip>
            ) : null}
          </span>
        </div>
      </WithTooltip>
      <DeleteAuthorTranslation
        authorId={authorId}
        disabled={!canDelete}
        translationId={translation.id}
      />
    </div>
  );
};

const s_authorTranslation = {
  container: tw`rounded-lg border text-base relative px-4 pb-1 pt-3`,
  authorName: tw`font-medium`,
  language: tw`absolute right-0 top-0 -translate-y-1/2 flex gap-xs items-center bg-white text-gray-600 `,
};

const AddAuthorTranslation = ({ author }: { author: Author }) => {
  const dispatch = useDispatch();

  return (
    <AddTranslation
      onAddTranslation={(languageId) =>
        dispatch(addTranslation({ id: author.id, languageId }))
      }
      parentDataType="author"
      translations={author.translations}
    />
  );
};

const DeleteAuthorTranslation = ({
  authorId,
  disabled = false,
  translationId,
}: {
  authorId: string;
  disabled?: boolean;
  translationId: string;
}) => {
  const dispatch = useDispatch();

  if (disabled) {
    return null;
  }

  return (
    <WithWarning
      callbackToConfirm={() =>
        dispatch(removeTranslation({ id: authorId, translationId }))
      }
      warningText={{
        heading: "Delete translation?",
        body: "This will affect all documents this author is connected to.",
      }}
    >
      <WithTooltip text="delete author translation">
        <button
          css={[
            tw`invisible opacity-0 group-hover:visible group-hover:opacity-100`,
            tw`absolute z-10 bottom-0 right-0 translate-y-1/2 translate-x-1/2 p-xxs rounded-full bg-gray-50 border`,
            s_button.deleteIconOnHover,
            tw`transition-all ease-in-out duration-75`,
          ]}
          type="button"
        >
          <Trash />
        </button>
      </WithTooltip>
    </WithWarning>
  );
};

const ExistingAuthors = ({
  authorIds: docAuthorIds,
  addAuthorToDoc,
}: PassedProps) => {
  const authorIds = useSelector(selectIds);

  return (
    <div css={[s_panelContent.section.container]}>
      <h4 css={[s_panelContent.section.title, tw`flex items-center gap-xs`]}>
        <span>Existing authors</span>
        {/* <InfoPopover /> */}
      </h4>
      {authorIds.length ? (
        <div css={[s_selectAuthor.authorsContainer, tw`mt-xs`]}>
          {authorIds.map((authorId, i) => {
            const isDocAuthor = docAuthorIds.includes(authorId);
            return (
              <ExistingAuthor
                addAuthorToDoc={() => addAuthorToDoc(authorId)}
                authorId={authorId}
                canAddToDoc={!isDocAuthor}
                number={i + 1}
                key={authorId}
              />
            );
          })}
        </div>
      ) : (
        <p css={[tw`text-base font-normal`]}>- No authors yet -</p>
      )}
    </div>
  );
};

const s_selectAuthor = {
  authorsContainer: tw`flex flex-col gap-md justify-center`,
};

const ExistingAuthor = ({
  authorId,
  addAuthorToDoc,
  canAddToDoc,
  number,
}: {
  addAuthorToDoc: () => void;
  canAddToDoc: boolean;
  authorId: string;
  number: number;
}) => {
  const author = useSelector((state) => selectById(state, authorId))!;

  return (
    <div
      css={[
        s_selectAuthorAuthor.container,
        !canAddToDoc && tw`opacity-40 pointer-events-none`,
      ]}
    >
      <span>{number}.</span>
      {canAddToDoc ? (
        <span>
          <WithTooltip text="Click to add author to article">
            <button
              css={[tw`p-1 hover:bg-gray-100 active:bg-gray-200 rounded-full`]}
              onClick={addAuthorToDoc}
              type="button"
            >
              <FilePlus />
            </button>
          </WithTooltip>
        </span>
      ) : null}
      <AuthorTranslations author={author} />
    </div>
  );
};

const s_selectAuthorAuthor = {
  container: tw`flex gap-sm items-center text-base font-normal`,
};

const AddNewAuthor = () => {
  const dispatch = useDispatch();

  return (
    <div css={[s_panelContent.section.container]}>
      <h4 css={[s_panelContent.section.title]}>Add new author</h4>
      <div css={[tw`font-normal text-base`]}>
        <TextFormInput
          onSubmit={(text) =>
            dispatch(addOne({ languageId: DEFAULTLANGUAGEID, name: text }))
          }
          placeholder="Enter author (then press enter)"
        />
      </div>
    </div>
  );
};

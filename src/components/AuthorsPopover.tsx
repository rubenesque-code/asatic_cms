import { Fragment, useEffect, useState } from "react";
import { Popover } from "@headlessui/react";
import tw from "twin.macro";
import {
  FilePlus,
  Info as InfoIcon,
  Trash,
  WarningCircle,
  XCircle,
} from "phosphor-react";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  selectById as selectAuthorById,
  selectIds as selectAuthorIds,
  addOne as addAuthor,
  updateName,
  addTranslation,
  removeTranslation,
} from "^redux/state/authors";
import { selectById as selectLanguageById } from "^redux/state/languages";

import { default_language_Id } from "^constants/data";

import { useDocAuthorTranslationContext } from "^context/DocAuthorTranslationContext";

import { Author as AuthorType } from "^types/author";

import WithTooltip from "^components/WithTooltip";
import TextFormInput from "^components/TextFormInput";
import WithProximityPopover from "^components/WithProximityPopover";
import InlineTextEditor from "^components/editors/Inline";
import WithWarning from "^components/WithWarning";
import AddTranslation from "^components/AddTranslation";

import s_button from "^styles/button";

const AuthorsPopover = () => {
  // const AuthorsPopover = (docAuthorContextProps: DocAuthorContextProps) => {
  return (
    // <DocAuthorContext {...docAuthorContextProps}>
    <Popover css={[s_popover.popover, tw`z-40`]}>
      {({ open }) => (
        <>
          <WithTooltip text="click to edit author" isDisabled={open}>
            <Popover.Button>
              <AuthorsLabel />
            </Popover.Button>
          </WithTooltip>
          {/*           <Popover.Panel css={[s_popover.panel]}>
            <AuthorsPanel />
          </Popover.Panel> */}
        </>
      )}
    </Popover>
    // </DocAuthorContext>
  );
};

const s_popover = {
  popover: tw`z-10 relative font-sans`,
  panel: tw`p-lg bg-white absolute origin-top bottom-0 translate-y-full shadow-lg rounded-md`,
};

export default AuthorsPopover;

const AuthorsLabel = () => {
  const { docAuthorsTranslationData, isAuthor } =
    useDocAuthorTranslationContext();

  return (
    <span css={[tw`text-xl w-full`]}>
      {!isAuthor ? (
        <span css={[tw`text-gray-placeholder`]}>Add author (optional)</span>
      ) : (
        docAuthorsTranslationData.map((t, i) => {
          const isAFollowingAuthor = i < docAuthorsTranslationData.length - 1;
          const nameForActiveLanguage = t.translationForActiveLanguage?.name;

          if (nameForActiveLanguage) {
            return (
              <span css={[tw`font-serif-eng`]} key={t.authorId}>
                {`${nameForActiveLanguage}${isAFollowingAuthor ? ", " : ""}`}
              </span>
            );
          }

          return (
            <span
              css={[
                tw`text-red-warning uppercase text-xs border border-red-warning rounded-sm mr-sm py-0.5 px-1 font-sans whitespace-nowrap`,
              ]}
              key={t.authorId}
            >
              Author translation missing <br /> for {activeLanguageName}
            </span>
          );
        })
      )}
    </span>
  );
};

const AuthorsPanel = () => {
  return (
    <div css={[s_contentTop.container]}>
      <h4 css={[s_contentTop.title]}>Authors</h4>
      <DocAuthors />
      <ExistingAuthors />
      <AddNewAuthor />
    </div>
  );
};

const s_contentTop = {
  container: tw`p-lg min-w-[35ch] flex flex-col gap-md`,
  title: tw`text-xl font-medium`,
};

const DocAuthors = () => {
  const [hasDispatchedNewTranslations, setHasDispatchedNewTranslations] =
    useState(false);

  const dispatch = useDispatch();

  const { activeLanguageId, docAuthors } = useDocAuthorContext();

  useEffect(() => {
    if (!docAuthors.length || hasDispatchedNewTranslations) {
      return;
    }
    setHasDispatchedNewTranslations(true);

    for (let i = 0; i < docAuthors.length; i++) {
      const author = docAuthors[i];

      const translationForActiveLanguage = author.translations.find(
        (t) => t.languageId === activeLanguageId
      );
      if (!translationForActiveLanguage) {
        dispatch(
          addTranslation({ id: author.id, languageId: activeLanguageId })
        );
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!docAuthors.length) {
    return null;
  }

  return (
    <div css={[s_panelSection.container]}>
      <h4 css={[s_panelSection.subTitle]}>Current Authors</h4>
      <div css={[s_currentAuthors.container]}>
        {docAuthors.map((author) => (
          <div css={[s_currentAuthors.authorContainer]} key={author.id}>
            <RemoveDocAuthor authorId={author.id} />
            <AuthorTranslations author={author} />
          </div>
        ))}
      </div>
    </div>
  );
};

const s_panelSection = {
  container: tw`flex flex-col gap-sm items-start text-base`,
  subTitle: tw`font-medium text-lg`,
};

const s_currentAuthors = {
  container: tw`flex flex-col gap-sm`,
  authorContainer: tw`flex flex-row w-full gap-sm items-center`,
};

const RemoveDocAuthor = ({ authorId }: { authorId: string }) => {
  const { onRemoveAuthorFromDoc, docType } = useDocAuthorContext();

  return (
    <WithWarning
      callbackToConfirm={() => onRemoveAuthorFromDoc(authorId)}
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

const AuthorTranslations = ({ author }: { author: AuthorType }) => {
  const { translations } = author;

  return (
    <div css={[s_authorTranslations.container]}>
      {translations.map((translation) => {
        return (
          <AuthorTranslation
            authorId={author.id}
            canDelete={translations.length > 1}
            translation={translation}
            key={translation.id}
          />
        );
      })}
      <AddAuthorTranslation author={author} />
    </div>
  );
};

const s_authorTranslations = {
  container: tw`flex gap-sm items-center text-base font-normal`,
};

const AuthorTranslation = ({
  authorId,
  canDelete,
  translation,
}: {
  authorId: string;
  canDelete: boolean;
  translation: AuthorType["translations"][number];
}) => {
  const dispatch = useDispatch();

  // todo: hook for below. Is repeated maybe in articles/id
  const language = useSelector((state) =>
    selectLanguageById(state, translation.languageId)
  );
  const noLanguageErrStr = "error";
  const languageStr = language ? language.name : noLanguageErrStr;

  return (
    <div
      css={[s_authorTranslation.container]}
      className="group"
      key={translation.id}
    >
      <WithTooltip text="click to edit">
        <div css={[s_authorTranslation.authorName]}>
          <InlineTextEditor
            injectedValue={translation.name}
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

const AddAuthorTranslation = ({ author }: { author: AuthorType }) => {
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

const ExistingAuthors = () => {
  const authorIds = useSelector(selectAuthorIds);

  return (
    <div css={[s_panelSection.container]}>
      <h4 css={[s_panelSection.subTitle, tw`flex items-center gap-xs`]}>
        <span>Existing authors</span>
        <InfoPopover />
      </h4>
      {authorIds.length ? (
        <div css={[s_selectAuthor.authorsContainer, tw`mt-xs`]}>
          {authorIds.map((authorId, i) => {
            return (
              <ExistingAuthor
                authorId={authorId}
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
  number,
}: {
  authorId: string;
  number: number;
}) => {
  const { docAuthorIds, onAddAuthorToDoc } = useDocAuthorContext();

  const isDocAuthor = docAuthorIds.includes(authorId);

  const author = useSelector((state) => selectAuthorById(state, authorId))!;

  return (
    <div
      css={[
        s_selectAuthorAuthor.container,
        isDocAuthor && tw`opacity-40 pointer-events-none`,
      ]}
      key={authorId}
    >
      <span>{number}.</span>
      {!isDocAuthor ? (
        <span>
          <WithTooltip text="Click to add author to article" key={authorId}>
            <button
              css={[tw`p-1 hover:bg-gray-100 active:bg-gray-200 rounded-full`]}
              onClick={() => onAddAuthorToDoc(authorId)}
              type="button"
            >
              <FilePlus />
            </button>
          </WithTooltip>
        </span>
      ) : null}
      <AuthorTranslations author={author} />
      {/*       <WithTooltip text="Add translation for author">
        <button
          css={[tw`p-1 hover:bg-gray-100 active:bg-gray-200 rounded-full`]}
          onClick={() =>
            dispatch(addTranslation({ id: author.id, languageId }))
          }
          type="button"
        >
          <PlusCircle />
        </button>
      </WithTooltip> */}
    </div>
  );
};

const s_selectAuthorAuthor = {
  container: tw`flex gap-sm items-center text-base font-normal`,
};

const AddNewAuthor = () => {
  const dispatch = useDispatch();

  return (
    <div css={[s_panelSection.container]}>
      <h4 css={[s_panelSection.subTitle]}>Add new author</h4>
      <div css={[tw`font-normal text-base`]}>
        <TextFormInput
          onSubmit={(text) =>
            dispatch(addAuthor({ languageId: default_language_Id, name: text }))
          }
          placeholder="Enter author (then press enter)"
        />
      </div>
    </div>
  );
};

const InfoPopover = () => {
  return (
    <WithProximityPopover panelContentElement={() => <InfoPanel />}>
      <div css={[tw`grid place-items-center`]}>
        <WithTooltip text="click for author info" yOffset={10}>
          <button
            css={[
              tw`p-xxs rounded-full hover:bg-gray-100 active:bg-gray-200 text-gray-500`,
            ]}
            type="button"
          >
            <InfoIcon />
          </button>
        </WithTooltip>
      </div>
    </WithProximityPopover>
  );
};

const InfoPanel = () => {
  return (
    <div css={[tw`text-gray-700 flex flex-col gap-xs p-sm min-w-[40ch]`]}>
      <h4 css={[s_panelSection.subTitle, tw`flex gap-xs items-center`]}>
        <InfoIcon weight="bold" />
        <span>Info</span>
      </h4>
      <p css={[tw`text-base font-normal`]}>
        Each author consists of names for each language its connected to through
        translations of documents.
        <br />
        To add a new translation, go to a document with the translation you
        want.
      </p>
    </div>
  );
};

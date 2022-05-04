import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import tw from "twin.macro";
import { Info as InfoIcon } from "phosphor-react";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  selectById as selectAuthorById,
  selectAll as selectAllAuthors,
  addOne as addAuthor,
} from "^redux/state/authors";
import { selectAll as selectAllLanguages } from "^redux/state/languages";

import { DEFAULTLANGUAGEID } from "^constants/data";

import WithTooltip from "^components/WithTooltip";
import TextFormInput from "^components/TextFormInput";
import WithProximityPopover from "./WithProximityPopover";

// todo: select author and display author should be more clearly demarcated?
// todo: add new author translation

const AuthorPopover = ({
  authorId,
  languageId,
  onAddAuthor,
}: {
  authorId: string | undefined;
  languageId: string;
  onAddAuthor: (authorId: string) => void;
}) => {
  const author = useSelector(
    (state) => authorId && selectAuthorById(state, authorId)
  );
  const authorTranslation =
    author && author.translations.find((t) => t.languageId === languageId);

  const authorStr = !author
    ? "Add author (optional)"
    : !authorTranslation
    ? "Add author name for this translation"
    : authorTranslation.name;

  return (
    <Popover className="group" css={[s_popover.popover]}>
      {({ open }) => (
        <>
          <WithTooltip text="click to select author" isDisabled={open}>
            <Popover.Button
              css={[s_popover.button, !author && tw`text-gray-placeholder`]}
            >
              {authorStr}
            </Popover.Button>
          </WithTooltip>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel css={[s_popover.panel]}>
              {({ close: closePopover }) => (
                <PanelContent
                  onAddAuthor={(authorId: string) => {
                    onAddAuthor(authorId);
                    closePopover();
                  }}
                />
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default AuthorPopover;

const s_popover = {
  popover: tw`relative`,
  button: tw`text-xl font-serif-eng`,
  panel: tw`p-lg bg-white absolute origin-top bottom-0 translate-y-full shadow-lg rounded-md`,
};

const PanelContent = ({
  onAddAuthor,
}: {
  onAddAuthor: (authorId: string) => void;
}) => {
  return (
    <div css={[s_panelTop.container]}>
      <h4 css={[s_panelTop.title]}>Authors</h4>
      <SelectAuthor onAddAuthor={onAddAuthor} />
      <AddNewAuthor />
    </div>
  );
};

const s_panelTop = {
  container: tw`p-lg min-w-[50ch] flex flex-col gap-md`,
  title: tw`text-xl font-medium`,
};

const SelectAuthor = ({
  onAddAuthor,
}: {
  onAddAuthor: (authorId: string) => void;
}) => {
  const authors = useSelector(selectAllAuthors);
  const languages = useSelector(selectAllLanguages);

  return (
    <div css={[s_panelSection.container]}>
      <h4 css={[s_panelSection.subTitle, tw`flex items-center gap-xs`]}>
        <span>Existing authors</span>
        <InfoPopover />
      </h4>
      {authors.length ? (
        <div css={[s_selectAuthor.authorsContainer, tw`mt-xs`]}>
          {authors.map((author, i) => (
            <div css={[s_selectAuthor.authorContainer]} key={author.id}>
              <span>{i + 1}.</span>
              {author.translations.map((t) => {
                // todo: how to handle possibility of language not existing?; could filter for languages
                const languageName = languages.find(
                  (language) => language.id === t.languageId
                )!.name;

                return (
                  <WithTooltip text="Click to add author to article" key={t.id}>
                    <button
                      css={[s_selectAuthor.authorButton]}
                      onClick={() => onAddAuthor(author.id)}
                      type="button"
                    >
                      <span css={[s_selectAuthor.authorName]}>{t.name}</span>
                      <span css={[s_selectAuthor.authorNameLanguage]}>
                        {languageName}
                      </span>
                    </button>
                  </WithTooltip>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <p>- No authors yet -</p>
      )}
    </div>
  );
};

const s_panelSection = {
  container: tw`flex flex-col gap-xs`,
  subTitle: tw`font-medium`,
};

const s_selectAuthor = {
  authorsContainer: tw`flex flex-col gap-md justify-center`,
  authorContainer: tw`flex gap-sm items-center`,
  authorButton: tw`rounded-lg border relative px-4 pb-1 pt-3`,
  authorName: tw`font-medium`,
  authorNameLanguage: tw`absolute right-0 top-0 -translate-y-1/2 bg-white text-gray-600 `,
};

const AddNewAuthor = () => {
  const dispatch = useDispatch();

  return (
    <div css={[s_panelSection.container]}>
      <h4 css={[tw`font-medium`]}>Add new author</h4>
      <TextFormInput
        onSubmit={(text) =>
          dispatch(addAuthor({ languageId: DEFAULTLANGUAGEID, name: text }))
        }
        placeholder="Enter author (then press enter)"
      />
    </div>
  );
};

const InfoPopover = () => {
  return (
    <WithProximityPopover panelContentElement={() => <InfoPanel />}>
      <div css={[tw`grid place-items-center`]}>
        <WithTooltip text="click for author info" yOffset={10}>
          <button
            css={[tw`p-xxs rounded-full hover:bg-gray-100 active:bg-gray-200`]}
            type="button"
          >
            <InfoIcon weight="bold" />
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
        <span>
          <InfoIcon weight="bold" />
        </span>
        <span>Info</span>
      </h4>
      <p>
        Each author consists of names for each language its connected to through
        translations of documents.
        <br />
        To add a new translation, go to a document with the translation you
        want.
      </p>
    </div>
  );
};

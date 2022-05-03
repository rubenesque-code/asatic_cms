import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import tw from "twin.macro";

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

// todo: select author and display author should be more clearly demarcated?

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
                <SelectAuthor
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

const SelectAuthor = ({
  onAddAuthor,
}: {
  onAddAuthor: (authorId: string) => void;
}) => {
  const authors = useSelector(selectAllAuthors);
  const languages = useSelector(selectAllLanguages);

  return (
    <div>
      <div css={[s_selectAuth.container]}>
        <h4 css={[s_selectAuth.title]}>Authors</h4>
        <div>
          <h4 css={[s_selectAuth.subTitle, tw`mb-sm`]}>Existing authors</h4>
          {authors.length ? (
            <div css={[tw`flex flex-col gap-md justify-center`]}>
              {authors.map((author, i) => (
                <div css={[tw`flex gap-sm`]} key={author.id}>
                  <span>{i + 1}.</span>
                  {author.translations.map((t) => {
                    // todo: how to handle possibility of language not existing?; could filter for languages
                    const languageName = languages.find(
                      (language) => language.id === t.languageId
                    )!.name;

                    return (
                      <WithTooltip
                        text="Click to add author to article"
                        key={t.id}
                      >
                        <button
                          css={[tw`rounded-lg border relative px-4 pb-1 pt-3`]}
                          onClick={() => onAddAuthor(author.id)}
                          type="button"
                        >
                          <span css={[tw`font-medium`]}>{t.name}</span>
                          <span
                            css={[
                              tw`absolute right-0 top-0 -translate-y-1/2 bg-white text-gray-600 `,
                            ]}
                          >
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
        <div>
          <h4 css={[tw`font-medium mb-sm`]}>Add new author</h4>
          <AddNewAuthor />
        </div>
      </div>
    </div>
  );
};

const s_selectAuth = {
  container: tw`p-lg min-w-[35ch] flex flex-col gap-sm`,
  title: tw`text-xl font-medium`,
  subTitle: tw`font-medium`,
};

const AddNewAuthor = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <TextFormInput
        onSubmit={(text) =>
          dispatch(addAuthor({ languageId: DEFAULTLANGUAGEID, name: text }))
        }
        placeholder="Enter author (then press enter)"
      />
    </div>
  );
};

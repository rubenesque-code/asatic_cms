import { Popover, Transition } from "@headlessui/react";
import { Plus } from "phosphor-react";
import { Fragment } from "react";
import tw, { css } from "twin.macro";
import WithTooltip from "^components/WithTooltip";
import { useDispatch, useSelector } from "^redux/hooks";
import {
  selectById as selectAuthorById,
  selectAll as selectAllAuthors,
  addOne as addAuthor,
} from "^redux/state/authors";
import { selectAll as selectAllLanguages } from "^redux/state/languages";
import InlineTextEditor from "./text-editor/Inline";

const AuthorPopover = ({
  authorId,
  languageId,
}: {
  authorId: string | undefined;
  languageId: string;
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
    <Popover className="group" css={[s.popover]}>
      {({ open }) => (
        <>
          <WithTooltip text="click to select author" isDisabled={open}>
            <Popover.Button
              css={[s.button, !author && tw`text-gray-placeholder`]}
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
            <Popover.Panel css={[s.panel]}>
              <SelectAuthor />
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

export default AuthorPopover;

const s = {
  popover: tw`relative`,
  button: tw`text-xl font-serif-eng`,
  panel: tw`p-lg bg-white absolute origin-top bottom-0 translate-y-full shadow-lg rounded-md`,
};

const SelectAuthor = () => {
  const dispatch = useDispatch();

  const authors = useSelector(selectAllAuthors);
  const languages = useSelector(selectAllLanguages);

  return (
    <div>
      <button
        css={[s_selectAuth.addNewButton]}
        onClick={() => dispatch(addAuthor())}
        type="button"
      >
        <span>add new</span>
        <span>
          <Plus />
        </span>
      </button>
      <div css={[tw`mt-md`]}>
        <h4 css={[tw`text-lg font-medium uppercase mb-sm`]}>Authors:</h4>
        {authors.length ? (
          authors.map((author, i) => (
            <div key={author.id}>
              <div css={[tw`flex gap-sm`]}>
                <span>{i + 1}.</span>
                {author.translations.map((t) => {
                  // todo: how to handle below; possibility of language not existing?; could filter for languages
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  const languageName = languages.find(
                    (language) => language.id === t.languageId
                  )!.name;
                  return (
                    <div key={t.id}>
                      <InlineTextEditor
                        initialValue={t.name}
                        onUpdate={() => null}
                        placeholder={`${languageName} author name here`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div>
            <p css={[tw`text-gray-600 text-base`]}>- No authors yet -</p>
          </div>
        )}
      </div>
    </div>
  );
};

const s_selectAuth = {
  addNewButton: tw`flex items-center  gap-sm py-1 px-2 uppercase tracking-wide rounded-sm font-medium bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white transition-colors ease-in-out duration-75`,
};

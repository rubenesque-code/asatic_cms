import { Fragment } from "react";
import { Popover, Transition } from "@headlessui/react";
import tw from "twin.macro";
import { FilePlus, Info as InfoIcon, PlusCircle } from "phosphor-react";

import { useDispatch, useSelector } from "^redux/hooks";

import {
  selectById as selectAuthorById,
  selectAll as selectAllAuthors,
  addOne as addAuthor,
  updateName,
  addTranslation,
} from "^redux/state/authors";
import { selectAll as selectAllLanguages } from "^redux/state/languages";

import { DEFAULTLANGUAGEID } from "^constants/data";

import WithTooltip from "^components/WithTooltip";
import TextFormInput from "^components/TextFormInput";
import WithProximityPopover from "./WithProximityPopover";
import InlineTextEditor from "./text-editor/Inline";

// todo: select author and display author should be more clearly demarcated?
// todo: add new author translation
// todo: grey out author if already used
// todo: default behaviour is to be able to edit author translation directly without opening popup? Would then have to allow opening of popup some other way to change it. Probs best not. Instead have new section above 'Existing Authors' title 'Current Author'

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
          <WithTooltip text="click to edit author" isDisabled={open}>
            <Popover.Button
              css={[
                s_popover.button,
                (!author || !authorTranslation) && tw`text-gray-placeholder`,
              ]}
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
                  authorId={authorId}
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
  popover: tw`relative font-sans`,
  button: tw`text-xl font-serif-eng`,
  panel: tw`p-lg bg-white absolute origin-top bottom-0 translate-y-full shadow-lg rounded-md`,
};

const PanelContent = ({
  authorId,
  onAddAuthor,
}: {
  authorId: string | undefined;
  onAddAuthor: (authorId: string) => void;
}) => {
  return (
    <div css={[s_panelTop.container]}>
      <h4 css={[s_panelTop.title]}>Authors</h4>
      <SelectAuthor authorId={authorId} onAddAuthor={onAddAuthor} />
      <AddNewAuthor />
    </div>
  );
};

const s_panelTop = {
  container: tw`p-lg min-w-[35ch] flex flex-col gap-md`,
  title: tw`text-xl font-medium`,
};

const SelectAuthor = ({
  authorId,
  onAddAuthor,
}: {
  authorId: string | undefined;
  onAddAuthor: (authorId: string) => void;
}) => {
  const dispatch = useDispatch();

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
          {authors.map((author, i) => {
            const authorIsActive = author.id === authorId;

            return (
              <div css={[s_selectAuthor.authorContainer]} key={author.id}>
                <span>{i + 1}.</span>
                <span>
                  <WithTooltip
                    text={
                      authorIsActive
                        ? "can't add: is current author for document"
                        : "Click to add author to article"
                    }
                    key={author.id}
                  >
                    <button
                      css={[
                        tw`p-1 hover:bg-gray-100 active:bg-gray-200 rounded-full`,
                        authorIsActive && tw`opacity-40`,
                      ]}
                      onClick={() => onAddAuthor(author.id)}
                      type="button"
                    >
                      <FilePlus />
                    </button>
                  </WithTooltip>
                </span>
                {author.translations.map((translation) => {
                  // todo: how to handle possibility of language not existing?; could filter for languages
                  const languageName = languages.find(
                    (language) => language.id === translation.languageId
                  )!.name;

                  return (
                    <div
                      css={[s_selectAuthor.authorButton]}
                      key={translation.id}
                    >
                      <WithTooltip
                        text={
                          author.translations.length < 2
                            ? "can't edit when only 1 translation of author"
                            : "click to edit"
                        }
                      >
                        <span css={[s_selectAuthor.authorName]}>
                          <InlineTextEditor
                            initialValue={translation.name}
                            onUpdate={(name) =>
                              dispatch(
                                updateName({
                                  id: author.id,
                                  name,
                                  translationId: translation.id,
                                })
                              )
                            }
                            placeholder="name"
                            disabled={author.translations.length < 2}
                          />
                        </span>
                      </WithTooltip>
                      <span css={[s_selectAuthor.authorNameLanguage]}>
                        {languageName}
                      </span>
                    </div>
                  );
                })}
                <WithTooltip text="Add translation for author">
                  <button
                    css={[
                      tw`p-1 hover:bg-gray-100 active:bg-gray-200 rounded-full`,
                    ]}
                    onClick={() =>
                      dispatch(addTranslation({ id: author.id, languageId }))
                    }
                    type="button"
                  >
                    <PlusCircle />
                  </button>
                </WithTooltip>
              </div>
            );
          })}
        </div>
      ) : (
        <p css={[tw`text-base font-normal`]}>- No authors yet -</p>
      )}
    </div>
  );
};

const s_panelSection = {
  container: tw`flex flex-col gap-xs`,
  subTitle: tw`font-medium text-lg`,
};

const s_selectAuthor = {
  authorsContainer: tw`flex flex-col gap-md justify-center`,
  authorContainer: tw`flex gap-sm items-center text-base font-normal`,
  authorButton: tw`rounded-lg border text-base relative px-4 pb-1 pt-3`,
  authorName: tw`font-medium`,
  authorNameLanguage: tw`absolute right-0 top-0 -translate-y-1/2 bg-white text-gray-600 `,
};

const AddNewAuthor = () => {
  const dispatch = useDispatch();

  return (
    <div css={[s_panelSection.container]}>
      <h4 css={[s_panelSection.subTitle]}>Add new author</h4>
      <div css={[tw`font-normal text-base`]}>
        <TextFormInput
          onSubmit={(text) =>
            dispatch(addAuthor({ languageId: DEFAULTLANGUAGEID, name: text }))
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

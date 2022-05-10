import { Fragment, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import tw from "twin.macro";
import {
  FilePlus,
  Info as InfoIcon,
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
} from "^redux/state/authors";
import { selectById as selectLanguageById } from "^redux/state/languages";

import { DEFAULTLANGUAGEID } from "^constants/data";

import WithTooltip from "^components/WithTooltip";
import TextFormInput from "^components/TextFormInput";
import WithProximityPopover from "./WithProximityPopover";
import InlineTextEditor from "./text-editor/Inline";
import { Author as AuthorType } from "^types/author";
import WithWarning from "./WithWarning";
import AddTranslation from "./AddTranslation";

// todo: select author and display author should be more clearly demarcated?
// todo: add new author translation
// todo: grey out author if already used
// todo: default behaviour is to be able to edit author translation directly without opening popup? Would then have to allow opening of popup some other way to change it. Probs best not. Instead have new section above 'Existing Authors' title 'Current Author'

// todo: add a 'add translation' button to existing authors too
// todo: is a bug where author translations display is going to block instead of flex

type CurrentAuthorId = string | undefined | null;
type OnAddAuthor = (authorId: string) => void;
type OnRemoveAuthor = () => void;

const useSelectAuthor = (currentAuthorId: CurrentAuthorId) => {
  const author = useSelector((state) =>
    currentAuthorId ? selectAuthorById(state, currentAuthorId) : null
  );

  return author;
};

const AuthorPopover = ({
  currentAuthorId,
  currentLanguageId,
  onAddAuthor,
  onRemoveAuthor,
}: {
  currentAuthorId: CurrentAuthorId;
  currentLanguageId: string;
  onAddAuthor: OnAddAuthor;
  onRemoveAuthor: OnRemoveAuthor;
}) => {
  return (
    <Popover css={[s_popover.popover]}>
      {({ open }) => (
        <>
          <WithTooltip text="click to edit author" isDisabled={open}>
            <Popover.Button>
              <AuthorLabel
                currentAuthorId={currentAuthorId}
                currentLanguageId={currentLanguageId}
              />
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
                  currentAuthorId={currentAuthorId}
                  currentLanguageId={currentLanguageId}
                  onAddAuthor={(authorId: string) => {
                    closePopover();
                    onAddAuthor(authorId);
                  }}
                  onRemoveAuthor={onRemoveAuthor}
                />
              )}
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

const s_popover = {
  popover: tw`relative font-sans`,
  panel: tw`p-lg bg-white absolute origin-top bottom-0 translate-y-full shadow-lg rounded-md`,
};

export default AuthorPopover;

const AuthorLabel = ({
  currentAuthorId,
  currentLanguageId,
}: {
  currentAuthorId: CurrentAuthorId;
  currentLanguageId: string;
}) => {
  const author = useSelector((state) =>
    currentAuthorId ? selectAuthorById(state, currentAuthorId) : null
  );
  const authorTranslation =
    author &&
    author.translations.find((t) => t.languageId === currentLanguageId);

  const isNoValidAuthorTranslation = !authorTranslation?.name.length;

  const authorStr = !author
    ? "Add author (optional)"
    : isNoValidAuthorTranslation
    ? "Add author name for this translation"
    : authorTranslation.name;

  return (
    <span
      css={[
        s_label.label,
        (!author || isNoValidAuthorTranslation) && tw`text-gray-placeholder`,
      ]}
    >
      {authorStr}
    </span>
  );
};

const s_label = {
  label: tw`text-xl font-serif-eng`,
};

const PanelContent = ({
  currentAuthorId,
  currentLanguageId,
  onAddAuthor,
  onRemoveAuthor,
}: {
  currentAuthorId: CurrentAuthorId;
  currentLanguageId: string;
  onAddAuthor: (authorId: string) => void;
  onRemoveAuthor: OnRemoveAuthor;
}) => {
  return (
    <div css={[s_contentTop.container]}>
      <h4 css={[s_contentTop.title]}>Authors</h4>
      <CurrentAuthor
        currentLanguageId={currentLanguageId}
        id={currentAuthorId}
        onRemoveAuthor={onRemoveAuthor}
      />
      <SelectAuthor
        currentAuthorId={currentAuthorId}
        onAddAuthor={onAddAuthor}
      />
      <AddNewAuthor />
    </div>
  );
};

const s_contentTop = {
  container: tw`p-lg min-w-[35ch] flex flex-col gap-md`,
  title: tw`text-xl font-medium`,
};

const CurrentAuthor = ({
  currentLanguageId,
  id,
  onRemoveAuthor,
}: {
  currentLanguageId: string;
  id: CurrentAuthorId;
  onRemoveAuthor: OnRemoveAuthor;
}) => {
  const author = useSelectAuthor(id);

  if (!author) {
    return null;
  }

  return (
    <div css={[s_panelSection.container]}>
      <h4 css={[s_panelSection.subTitle]}>Current Author</h4>
      <div css={[s_currentAuthor.container]}>
        <RemoveCurrentAuthor onRemoveAuthor={onRemoveAuthor} />
        <AuthorTranslations
          author={author}
          currentLanguageId={currentLanguageId}
        />
        <AddAuthorTranslation author={author} />
      </div>
    </div>
  );
};

const s_panelSection = {
  container: tw`flex flex-col gap-sm items-start text-base`,
  subTitle: tw`font-medium text-lg`,
};

const s_currentAuthor = {
  container: tw`flex flex-row w-full border gap-sm items-center`,
};

const RemoveCurrentAuthor = ({
  docType = "article",
  onRemoveAuthor,
}: {
  docType?: "article";
  onRemoveAuthor: OnRemoveAuthor;
}) => {
  return (
    <WithWarning
      callbackToConfirm={onRemoveAuthor}
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

const AuthorTranslations = ({
  author,
  currentLanguageId,
}: {
  author: AuthorType;
  currentLanguageId?: string;
}) => {
  const dispatch = useDispatch();

  const { translations } = author;

  useEffect(() => {
    if (!currentLanguageId) {
      return;
    }

    const isTranslationForCurrentLanguage = translations.find(
      (t) => t.languageId === currentLanguageId
    );
    if (!isTranslationForCurrentLanguage) {
      dispatch(
        addTranslation({ id: author.id, languageId: currentLanguageId })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div css={[s_authorTranslations]}>
      {translations.map((translation) => {
        return (
          <AuthorTranslation
            authorId={author.id}
            translation={translation}
            key={translation.id}
          />
        );
      })}
    </div>
  );
};

const s_authorTranslations = {
  container: tw`flex flex-grow flex-row flex-nowrap gap-sm items-center text-base font-normal`,
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

const AuthorTranslation = ({
  authorId,
  translation,
}: {
  authorId: string;
  translation: AuthorType["translations"][number];
}) => {
  const dispatch = useDispatch();

  const language = useSelector((state) =>
    selectLanguageById(state, translation.languageId)
  );
  const noLanguageErrStr = "error";
  const languageStr = language ? language.name : noLanguageErrStr;

  return (
    <div css={[s_authorTranslation.container]} key={translation.id}>
      <WithTooltip text="click to edit">
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
    </div>
  );
};

const s_authorTranslation = {
  container: tw`rounded-lg border text-base relative px-4 pb-1 pt-3`,
  authorName: tw`font-medium`,
  language: tw`absolute right-0 top-0 -translate-y-1/2 flex gap-xs items-center bg-white text-gray-600 `,
};

const SelectAuthor = ({
  currentAuthorId,
  onAddAuthor,
}: {
  currentAuthorId: CurrentAuthorId;
  onAddAuthor: OnAddAuthor;
}) => {
  // const dispatch = useDispatch();

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
            const isCurrentAuthor = currentAuthorId === authorId;

            return (
              <SelectAuthorAuthor
                authorId={authorId}
                isCurrentAuthor={isCurrentAuthor}
                number={i + 1}
                onAddAuthor={onAddAuthor}
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

const SelectAuthorAuthor = ({
  authorId,
  isCurrentAuthor,
  number,
  onAddAuthor,
}: {
  authorId: string;
  isCurrentAuthor: boolean;
  number: number;
  onAddAuthor: (authorId: string) => void;
}) => {
  // const dispatch = useDispatch();

  const author = useSelectAuthor(authorId)!;

  return (
    <div
      css={[s_selectAuthorAuthor.container, isCurrentAuthor && tw`opacity-40`]}
      key={authorId}
    >
      <span>{number}.</span>
      <span>
        <WithTooltip
          text="Click to add author to article"
          isDisabled={isCurrentAuthor}
          key={authorId}
        >
          <button
            css={[tw`p-1 hover:bg-gray-100 active:bg-gray-200 rounded-full`]}
            onClick={() => onAddAuthor(authorId)}
            type="button"
          >
            <FilePlus />
          </button>
        </WithTooltip>
      </span>
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

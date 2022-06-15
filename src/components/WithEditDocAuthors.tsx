import { FormEvent, ReactElement, useState } from "react";
import tw from "twin.macro";
import {
  FilePlus,
  Plus,
  Translate,
  Trash,
  WarningCircle,
} from "phosphor-react";
import { v4 as generateUId } from "uuid";

import { useSelector, useDispatch } from "^redux/hooks";
import {
  selectAll,
  selectEntitiesByIds,
  addOne,
  selectById,
  updateName,
  addTranslation,
} from "^redux/state/authors";
import { selectById as selectLanguageById } from "^redux/state/languages";

import { fuzzySearch } from "^helpers/general";

import useFocused from "^hooks/useFocused";

import WithProximityPopover from "./WithProximityPopover";
import WithTooltip from "./WithTooltip";
import WithWarning from "./WithWarning";

import s_transition from "^styles/transition";
import { s_popover } from "^styles/popover";
import { Author as AuthorType } from "^types/author";
import LanguageError from "./LanguageError";
import { DEFAULTLANGUAGEID } from "^constants/data";
import InlineTextEditor from "./editors/Inline";

// todo: want to highlight and make changeable author translations for the translations of the doc. Show other translations but de-emphasised.
// todo: on addAuthor, allow language choice, but only for doc languages

// todo: author names not unique. reinforces need to be able to see author relationship to docs, such as articles.

type Props = {
  children: ReactElement;
  onRemoveFromDoc: (tagId: string) => void;
} & AuthorInputWithSelectProps;

const WithEditDocAuthors = ({
  children,
  docAuthorIds,
  docLanguageIds,
}: {
  children: ReactElement;
  docAuthorIds: string[];
  docLanguageIds: string[];
}) => {
  return (
    <WithProximityPopover
      panelContentElement={
        <Panel docAuthorsIds={docAuthorIds} docLanguageIds={docLanguageIds} />
      }
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithEditDocAuthors;

const Panel = ({
  docAuthorsIds,
  docLanguageIds,
}: {
  docAuthorsIds: string[];
  docLanguageIds: string[];
}) => {
  const areDocAuthors = Boolean(docAuthorsIds.length);

  return (
    <PanelUI
      areDocAuthors={areDocAuthors}
      docAuthorsList={
        <AuthorsListUI
          areDocAuthors={areDocAuthors}
          listItems={
            <AuthorsListItems
              docAuthorIds={docAuthorsIds}
              docLanguageIds={docLanguageIds}
            />
          }
        />
      }
    />
  );
};

const PanelUI = ({
  areDocAuthors,
  docAuthorsList,
}: {
  areDocAuthors: boolean;
  docAuthorsList: ReactElement;
}) => {
  return (
    <div css={[s_popover.container]}>
      <div>
        <h4 css={[tw`font-medium text-lg`]}>Authors</h4>
        <p css={[tw`text-gray-600 mt-xs text-sm`]}>
          {!areDocAuthors
            ? "You haven't added any authors to this article yet."
            : "Edit authors for this document and their translations."}
        </p>
      </div>
      <div css={[tw`flex flex-col gap-lg items-start`]}>
        {docAuthorsList}
        {/*         <AuthorsInputWithSelect
          docAuthorIds={[]}
          docType={"article"}
          onSubmit={() => null}
        /> */}
      </div>
    </div>
  );
};

const AuthorsListUI = ({
  areDocAuthors,
  listItems,
}: {
  areDocAuthors: boolean;
  listItems: ReactElement;
}) => {
  return areDocAuthors ? (
    <div css={[tw`flex flex-col gap-sm`]}>{listItems}</div>
  ) : null;
};

const AuthorsListItems = ({
  docAuthorIds,
  docLanguageIds,
}: {
  docAuthorIds: string[];
  docLanguageIds: string[];
}) => {
  return (
    <>
      {docAuthorIds.map((id, i) => (
        <AuthorsListItem
          authorId={id}
          docLanguageIds={docLanguageIds}
          index={i}
          key={id}
        />
      ))}
    </>
  );
};

const AuthorsListItem = ({
  authorId,
  docLanguageIds,
  index,
}: {
  authorId: string;
  docLanguageIds: string[];
  index: number;
}) => {
  const number = index + 1;

  return (
    <AuthorsListItemUI
      author={<Author authorId={authorId} docLanguageIds={docLanguageIds} />}
      number={number}
    />
  );
};

const AuthorsListItemUI = ({
  author,
  number,
}: {
  number: number;
  author: ReactElement;
}) => {
  return (
    <div css={[tw`relative flex`]} className="group">
      <span css={[tw`text-gray-600 w-[25px]`]}>{number}.</span>
      {author}
    </div>
  );
};

const Author = ({
  authorId,
  docLanguageIds,
}: {
  authorId: string;
  docLanguageIds: string[];
}) => {
  const author = useSelector((state) => selectById(state, authorId));

  return author ? (
    <AuthorUI
      translations={
        <AuthorTranslations
          authorId={authorId}
          docLanguageIds={docLanguageIds}
          translations={author.translations}
        />
      }
    />
  ) : (
    <AuthorErrorUI />
  );
};

const AuthorUI = ({ translations }: { translations: ReactElement }) => {
  return <div css={[tw`flex gap-sm items-center`]}>{translations}</div>;
};

const AuthorErrorUI = () => {
  return (
    <WithTooltip
      text={{
        header: "Author error",
        body: "An author was added to this document that can't be found. Try refreshing the page. If the problem persists, contact the site developer.",
      }}
    >
      <span css={[tw`text-red-500`]}>
        <WarningCircle />
      </span>
    </WithTooltip>
  );
};

const AuthorTranslations = ({
  authorId,
  docLanguageIds,
  translations,
}: {
  authorId: string;
  docLanguageIds: string[];
  translations: AuthorType["translations"];
}) => {
  const nonDocLanguageTranslations = translations.filter(
    (t) => !docLanguageIds.includes(t.languageId)
  );

  return (
    <AuthorTranslationsUI
      docLanguageTranslations={
        <>
          {docLanguageIds.map((languageId, i) => (
            <AuthorTranslation
              index={i}
              authorId={authorId}
              languageId={languageId}
              translation={translations.find(
                (t) => t.languageId === languageId
              )}
              type="doc"
              key={languageId}
            />
          ))}
        </>
      }
      nonDocLanguageTranslations={
        <>
          {nonDocLanguageTranslations.map((t, i) => (
            <AuthorTranslation
              authorId={authorId}
              index={i}
              languageId={t.languageId}
              translation={t}
              type="non-doc"
              key={t.id}
            />
          ))}
        </>
      }
    />
  );
};

const AuthorTranslationsUI = ({
  docLanguageTranslations,
  nonDocLanguageTranslations,
}: {
  docLanguageTranslations: ReactElement;
  nonDocLanguageTranslations: ReactElement;
}) => {
  return (
    <div css={[tw`flex items-center gap-lg`]}>
      <div css={[tw`flex items-center gap-sm`]}>{docLanguageTranslations}</div>
      <div css={[tw`flex items-center gap-sm`]}>
        <div css={[tw`flex items-center gap-xxs`]}>
          <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
          <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} />
        </div>
        {nonDocLanguageTranslations}
      </div>
    </div>
  );
};

const AuthorTranslation = ({
  // docLanguageIds,
  authorId,
  index,
  languageId,
  translation,
  type,
}: {
  // docLanguageIds: string[];
  authorId: string;
  index: number;
  languageId: string;
  translation: AuthorType["translations"][number] | undefined;
  type: "doc" | "non-doc";
}) => {
  // const isDocLanguage = docLanguageIds.includes(languageId);
  const dispatch = useDispatch();
  const isFirst = Boolean(index === 0);

  const handleUpdateAuthorTranslation = (name: string) => {
    if (translation) {
      dispatch(
        updateName({ id: authorId, translationId: translation.id, name })
      );
    } else {
      dispatch(addTranslation({ id: authorId, languageId, name }));
    }

    return;
  };
  const translationText = translation?.name;

  return (
    <AuthorTranslationUI
      isDocLanguage={type === "doc"}
      isFirst={isFirst}
      language={<AuthorTranslationLanguage languageId={languageId} />}
      // translationText={translation?.name || ''}
      translationText={
        <WithTooltip
          text={{
            header: "Edit author translation",
            body: "Updating this author will affect this author across all documents it's a part of.",
          }}
        >
          <div>
            <InlineTextEditor
              initialValue={translationText}
              onUpdate={(text) => handleUpdateAuthorTranslation(text)}
              placeholder="author..."
              disabled={type === "non-doc"}
              minWidth={30}
            />
          </div>
        </WithTooltip>
      }
    />
  );
};

const AuthorTranslationUI = ({
  isDocLanguage,
  isFirst,
  language,
  translationText,
}: // input
{
  isDocLanguage: boolean;
  isFirst: boolean;
  language: ReactElement;
  translationText: ReactElement;
  // input: ReactElement
}) => {
  return (
    <div css={[tw`flex gap-sm items-center`]}>
      {!isFirst ? <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} /> : null}
      <div
        css={[
          tw`flex gap-xs`,
          !isDocLanguage && tw`pointer-events-none opacity-40`,
        ]}
      >
        {/* <p>{translationText}</p> */}
        <span>{translationText}</span>
        <p css={[tw`flex gap-xxxs items-center`]}>
          <span css={[tw`text-xs -translate-y-1 text-gray-500`]}>
            <Translate />
          </span>
          {language}
        </p>
      </div>
    </div>
  );
};

const AuthorTranslationLanguage = ({ languageId }: { languageId: string }) => {
  const language = useSelector((state) =>
    selectLanguageById(state, languageId)
  );

  return language ? (
    <AuthorTranslationLanguageUI languageText={language.name} />
  ) : (
    <LanguageError />
  );
};

const AuthorTranslationLanguageUI = ({
  languageText,
}: {
  languageText: string;
}) => {
  return (
    <span css={[tw`capitalize text-gray-600 text-sm`]}>{languageText}</span>
  );
};

{
  /*       <WithWarning
        callbackToConfirm={() => onRemoveFromDoc(author.id)}
        warningText={{ heading: `Remove tag from ${docType}?` }}
        type="moderate"
      >
        {({ isOpen: warningIsOpen }) => (
          <WithTooltip
            text={`remove tag from ${docType}`}
            placement="top"
            isDisabled={warningIsOpen}
            type="action"
          >
            <button
              css={[
                tw`group-hover:visible group-hover:opacity-100 invisible opacity-0 transition-opacity ease-in-out duration-75`,
                tw`ml-lg`,
                tw`text-gray-600 p-xxs hover:bg-gray-100 hover:text-red-warning active:bg-gray-200 rounded-full grid place-items-center`,
              ]}
              type="button"
            >
              <Trash />
            </button>
          </WithTooltip>
        )}
      </WithWarning> */
}

const inputId = "author-input";

type AuthorInputWithSelectProps = {
  docAuthorIds: string[];
  docType: string;
  onSubmit: (authorId: string) => void;
};

const AuthorsInputWithSelect = ({
  docAuthorIds,
  onSubmit,
  docType,
}: AuthorInputWithSelectProps) => {
  const [inputValue, setInputValue] = useState("");

  const [inputIsFocused, focusHandlers] = useFocused();

  const allAuthors = useSelector(selectAll);
  const docAuthors = useSelector((state) =>
    selectEntitiesByIds(state, docAuthorIds)
  );
  const docTagsText = docAuthors.map((t) => t?.text);

  const inputValueIsDocTag = docTagsText.includes(inputValue);

  const dispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValueIsDocTag) {
      return;
    }

    const existingTag = allAuthors.find((t) => t.text === inputValue);

    if (existingTag) {
      onSubmit(existingTag.id);
    } else {
      const id = generateUId();
      dispatch(addOne({ id, text: inputValue }));
      onSubmit(id);
      setInputValue("");
    }
  };

  return (
    <div css={[tw`relative inline-block self-start`]}>
      <form onSubmit={handleSubmit}>
        <div css={[tw`relative`]}>
          <input
            css={[
              tw`px-lg py-1 text-sm outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
            ]}
            // css={[tw`px-lg py-0.5 text-sm outline-offset[5px]`]}
            id={inputId}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value.toLowerCase())}
            placeholder="Add a new author..."
            type="text"
            autoComplete="off"
            {...focusHandlers}
          />
          <label
            css={[tw`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500`]}
            htmlFor={inputId}
          >
            <Plus />
          </label>
          {inputValueIsDocTag ? (
            <WithTooltip text="A tag with this text is already connected to this document">
              <span
                css={[
                  tw`absolute top-1/2 -translate-y-1/2 right-2 text-red-warning`,
                ]}
              >
                <WarningCircle />
              </span>
            </WithTooltip>
          ) : null}
        </div>
      </form>
      <TagsSelect
        docAuthorIds={docAuthorIds}
        docType={docType}
        onSubmit={(languageId) => {
          onSubmit(languageId);
          setInputValue("");
        }}
        query={inputValue}
        show={inputIsFocused && inputValue.length > 1}
      />
      <div
        css={[
          tw`absolute top-2 right-0 -translate-y-full flex items-center gap-xxs bg-white`,
          s_transition.toggleVisiblity(inputIsFocused),
          tw`transition-opacity duration-75 ease-in-out`,
        ]}
      >
        <span css={[tw`text-sm -translate-y-1 text-gray-400`]}>
          <Translate weight="light" />
        </span>
        <span css={[tw`capitalize text-gray-400 text-sm`]}>English</span>
      </div>
    </div>
  );
};

const TagsSelect = ({
  docAuthorIds: docTagIds,
  docType,
  onSubmit,
  query,
  show,
}: AuthorInputWithSelectProps & { query: string; show: boolean }) => {
  const allTags = useSelector(selectAll);

  const tagsMatchingQuery = fuzzySearch(["text"], allTags, query).map(
    (f) => f.item
  );

  return (
    <div
      css={[
        tw`absolute -bottom-2 translate-y-full w-full bg-white border-2 border-gray-200 rounded-sm py-sm text-sm shadow-lg`,
        show ? tw`opacity-100` : tw`opacity-0 h-0`,
        tw`transition-opacity duration-75 ease-linear`,
      ]}
    >
      {tagsMatchingQuery.length ? (
        <div css={[tw`flex flex-col gap-xs items-start`]}>
          {tagsMatchingQuery.map((tag) => {
            const isDocTag = docTagIds.includes(tag.id);
            return (
              <WithTooltip
                text={`add tag to ${docType}`}
                type="action"
                isDisabled={isDocTag}
                key={tag.id}
              >
                <button
                  css={[
                    tw`text-left py-1 relative w-full px-sm hover:bg-gray-50`,
                  ]}
                  className="group"
                  onClick={() => {
                    if (isDocTag) {
                      return;
                    }
                    onSubmit(tag.id);
                  }}
                  type="button"
                >
                  {tag.text}
                  <span
                    css={[
                      s_transition.onGroupHover,
                      tw`absolute right-2 top-1/2 -translate-y-1/2 text-green-600`,
                    ]}
                  >
                    <FilePlus />
                  </span>
                </button>
              </WithTooltip>
            );
          })}
        </div>
      ) : (
        <p css={[tw`text-gray-600 ml-sm`]}>No matches</p>
      )}
    </div>
  );
};

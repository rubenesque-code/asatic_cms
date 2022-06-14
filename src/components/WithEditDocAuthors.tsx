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
} from "^redux/state/authors";
import { selectById as selectLanguageById } from "^redux/state/languages";

import { fuzzySearch } from "^helpers/general";

import useFocused from "^hooks/useFocused";

import WithProximityPopover from "./WithProximityPopover";
import WithTooltip from "./WithTooltip";
import WithWarning from "./WithWarning";

import s_transition from "^styles/transition";
import { s_popover } from "^styles/popover";
import { Author } from "^types/author";
import LanguageError from "./LanguageError";
import { DEFAULTLANGUAGEID } from "^constants/data";

// todo: want to highlight and make changeable author translations for the translations of the doc. Show other translations but de-emphasised.
// todo: on addAuthor, allow language choice, but only for doc languages

// todo: author names not unique. reinforces need to be able to see author relationship to docs, such as articles.

type Props = {
  children: ReactElement;
  onRemoveFromDoc: (tagId: string) => void;
} & AuthorInputWithSelectProps;

const WithEditDocAuthors = ({ children, ...passedProps }: Props) => {
  return (
    <WithProximityPopover
      panelContentElement={<Panel2 docAuthorsIds={passedProps.docAuthorIds} />}
    >
      {/* <WithProximityPopover panelContentElement={<Panel {...passedProps} />}> */}
      {children}
    </WithProximityPopover>
  );
};

export default WithEditDocAuthors;

const Panel2 = ({ docAuthorsIds }: { docAuthorsIds: string[] }) => {
  const areDocAuthors = Boolean(docAuthorsIds.length);

  return (
    <PanelUI
      areDocAuthors={areDocAuthors}
      docAuthors={<AuthorsList docAuthorIds={docAuthorsIds} />}
    />
  );
};

const PanelUI = ({
  areDocAuthors,
  docAuthors,
}: {
  areDocAuthors: boolean;
  docAuthors: ReactElement;
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
        {areDocAuthors ? (
          <div css={[tw`flex flex-col gap-sm`]}>{docAuthors}</div>
        ) : null}
        {/*         <AuthorsInputWithSelect
          docAuthorIds={[]}
          docType={"article"}
          onSubmit={() => null}
        /> */}
      </div>
    </div>
  );
};

const AuthorsList = ({ docAuthorIds }: { docAuthorIds: string[] }) => {
  return (
    <>
      {docAuthorIds.map((id, i) => (
        <AuthorsListItem authorId={id} index={i} key={id} />
      ))}
    </>
  );
};

const AuthorsListItem = ({
  authorId,
  index,
}: {
  authorId: string;
  index: number;
}) => {
  const number = index + 1;

  return (
    <AuthorsListItemUI
      author={<Author2 authorId={authorId} />}
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

const Author2 = ({ authorId }: { authorId: string }) => {
  const author = useSelector((state) => selectById(state, authorId));

  return author ? (
    <AuthorUI
      translations={<AuthorTranslations translations={author.translations} />}
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
  translations,
}: {
  translations: Author["translations"];
}) => {
  return (
    <>
      {translations.map((t, i) => (
        <AuthorTranslation2 index={i} translation={t} key={t.id} />
      ))}
    </>
  );
};

const AuthorTranslation2 = ({
  index,
  translation,
}: {
  index: number;
  translation: Author["translations"][number];
}) => {
  const { languageId, name } = translation;

  const isFirst = Boolean(index === 0);

  return (
    <AuthorTranslationUI
      isFirst={isFirst}
      language={<AuthorTranslationLanguage languageId={languageId} />}
      translationText={name}
    />
  );
};

const AuthorTranslationUI = ({
  isFirst,
  language,
  translationText,
}: {
  isFirst: boolean;
  language: ReactElement;
  translationText: string;
}) => {
  return (
    <div css={[tw`flex gap-sm items-center`]}>
      {!isFirst ? <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} /> : null}
      <div css={[tw`flex gap-xs`]}>
        <p>{translationText}</p>
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

const Panel = ({
  docType,
  onRemoveFromDoc,
  ...passedProps
}: {
  onRemoveFromDoc: (authorId: string) => void;
} & AuthorInputWithSelectProps) => {
  const { docAuthorIds } = passedProps;

  const docAuthors = useSelector((state) =>
    selectEntitiesByIds(state, docAuthorIds)
  );

  const areDocAuthors = docAuthors.length;

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
        {areDocAuthors ? (
          <div css={[tw`flex flex-col gap-sm`]}>
            {docAuthors.map((tag, i) => (
              <DocAuthor
                docType={docType}
                number={i}
                onRemoveFromDoc={onRemoveFromDoc}
                author={tag}
                key={tag.id}
              />
            ))}
          </div>
        ) : null}
        <AuthorsInputWithSelect
          docAuthorIds={[]}
          docType={"article"}
          onSubmit={() => null}
        />
      </div>
    </div>
  );
};

type DocTagProps = {
  docType: string;
  onRemoveFromDoc: (authorId: string) => void;
  number: number;
  author: Author;
};

const DocAuthor = ({
  docType,
  author,
  onRemoveFromDoc,
  number,
}: DocTagProps) => {
  return (
    <div css={[tw`relative flex`]} className="group">
      <span css={[tw`text-gray-600 w-[25px]`]}>{number + 1}.</span>
      <div css={[tw`flex gap-sm items-center`]}>
        {author.translations.map((t, i) => (
          <AuthorTranslation index={i} translation={t} key={t.id} />
        ))}
      </div>
      {/*       <WithWarning
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
      </WithWarning> */}
    </div>
  );
};

const AuthorTranslation = ({
  index,
  translation,
}: {
  index: number;
  translation: Author["translations"][number];
}) => {
  const language = useSelector((state) =>
    selectLanguageById(state, translation.languageId)
  );

  return (
    <div css={[tw`flex gap-sm items-center`]}>
      {index > 0 ? <div css={[tw`h-[20px] w-[0.5px] bg-gray-200`]} /> : null}
      <div css={[tw`flex gap-xs`]}>
        <p>{translation.name}</p>
        <p css={[tw`flex gap-xxxs items-center`]}>
          <span css={[tw`text-xs -translate-y-1 text-gray-500`]}>
            <Translate />
          </span>
          {language ? (
            <span css={[tw`capitalize text-gray-600 text-sm`]}>
              {language?.name}
            </span>
          ) : (
            <LanguageError />
          )}
        </p>
      </div>
    </div>
  );
};

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

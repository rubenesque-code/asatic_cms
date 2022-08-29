import { NextPage } from "next";
import {
  Article as ArticleIcon,
  CloudArrowUp,
  Funnel,
  GitBranch,
  Plus,
  Prohibit,
  Trash,
} from "phosphor-react";
import {
  createContext,
  FormEvent,
  ReactElement,
  useContext,
  useState,
} from "react";
import tw from "twin.macro";

import { Collection } from "^lib/firebase/firestore/collectionKeys";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne,
  selectAll,
  updateText,
  removeOne as deleteTag,
} from "^redux/state/tags";
import {
  selectArticles as selectAllArticles,
  removeTag as removeTagFromArticle,
} from "^redux/state/articles";

import { useLeavePageConfirm } from "^hooks/useLeavePageConfirm";
import useTagsPageTopControls from "^hooks/pages/useTagsPageTopControls";
import useFocused from "^hooks/useFocused";
import useTagArticles from "^hooks/data/useTagArticles";

import { fuzzySearchTags } from "^helpers/tags";
import { applyFilters } from "^helpers/general";

import { Tag } from "^types/tag";

import Head from "^components/Head";
import SaveButtonUI from "^components/header/SaveButtonUI";
import SaveTextUI from "^components/header/SaveTextUI";
import SideBar from "^components/header/SideBar";
import UndoButtonUI from "^components/header/UndoButtonUI";
import QueryDatabase from "^components/QueryDatabase";
import UsedTypeRadioUI from "^components/UsedTypeRadio";
import WithProximityPopover from "^components/WithProximityPopover";
import WithTooltip from "^components/WithTooltip";
import InlineTextEditor from "^components/editors/Inline";
import MissingText from "^components/MissingText";
import WithWarning from "^components/WithWarning";
import WithRelatedArticles from "^components/WithRelatedArticles";

import { s_header } from "^styles/header";
import { s_popover } from "^styles/popover";
import s_transition from "^styles/transition";
import { s_editorMenu } from "^styles/menus";

// show filtered articles list
// clicking on tag updates tag name filter

// todo: menu styling

// todo: haven't considered multiple users - may add same tag at same time - need to check as saving; use cloud function

const Tags: NextPage = () => {
  return (
    <>
      <Head />
      <QueryDatabase
        collections={[
          Collection.TAGS,
          Collection.ARTICLES,
          Collection.LANGUAGES,
        ]}
      >
        <PageContent />
      </QueryDatabase>
    </>
  );
};

export default Tags;

const PageContent = () => {
  return (
    <div css={[tw`min-h-screen flex-col gap-lg`]}>
      <Header />
      <Main />
    </div>
  );
};

const Header = () => {
  const { handleSave, handleUndo, isChange, saveMutationData } =
    useTagsPageTopControls();

  useLeavePageConfirm({ runConfirmOn: isChange });

  return (
    <header css={[s_header.container, tw`border-b`]}>
      <div css={[tw`flex items-center gap-lg`]}>
        <SideBar />
        <div css={[s_header.spacing]}>
          <SaveTextUI isChange={isChange} saveMutationData={saveMutationData} />
        </div>
      </div>
      <div css={[s_header.spacing]}>
        <UndoButtonUI
          handleUndo={handleUndo}
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
        />
        <SaveButtonUI
          handleSave={handleSave}
          isChange={isChange}
          isLoadingSave={saveMutationData.isLoading}
        />
        <div css={[s_header.verticalBar]} />
        <button css={[s_header.button]}>
          <CloudArrowUp />
        </button>
      </div>
    </header>
  );
};

const Main = () => {
  return (
    <div css={[tw`flex justify-center`]}>
      <main css={[s_top.main, tw`px-xl max-w-[1600px]`]}>
        <div>
          <h1 css={[s_top.pageTitle]}>Edit Tags</h1>
          <p css={[tw`text-gray-600 text-sm mt-sm`]}>
            Search for and edit tags.
            <br />
            Tags allow all documents, such as articles and videos, to be
            categorised on the website.
          </p>
        </div>
        <FiltersAndLists />
      </main>
    </div>
  );
};

const s_top = {
  main: tw`px-4 mt-2xl flex flex-col gap-lg flex-grow`,
  pageTitle: tw`text-2xl font-medium`,
};

export type UsedTypeFilter = "used" | "unused" | "all";

type FiltersContextValue = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  usedType: UsedTypeFilter;
  setUsedType: (type: UsedTypeFilter) => void;
};
const SelectedLanguageContext = createContext<FiltersContextValue>(
  {} as FiltersContextValue
);
const FiltersProvider = ({ children }: { children: ReactElement }) => {
  const [searchValue, setSearchValue] = useState("");
  const [usedType, setUsedType] = useState<UsedTypeFilter>("all");

  return (
    <SelectedLanguageContext.Provider
      value={{
        searchValue,
        setSearchValue: (value: string) => setSearchValue(value),
        setUsedType: (usedType: UsedTypeFilter) => setUsedType(usedType),
        usedType,
      }}
    >
      {children}
    </SelectedLanguageContext.Provider>
  );
};
const useFiltersContext = () => {
  const context = useContext(SelectedLanguageContext);
  if (context === undefined) {
    throw new Error("useFiltersContext must be used within its provider!");
  }
  return context;
};

const FiltersAndLists = () => {
  return (
    <FiltersProvider>
      <FiltersAndListsUI
        filters={
          <FiltersUI search={<SearchUI />} usedTypeRadio={<UsedTypeRadio />} />
        }
        tagsList={<TagsList />}
        articlesList={<></>}
      />
    </FiltersProvider>
  );
};

const FiltersAndListsUI = ({
  filters,
  articlesList,
  tagsList,
}: {
  filters: ReactElement;
  tagsList: ReactElement;
  articlesList: ReactElement;
}) => {
  return (
    <div css={[tw`mt-md`]}>
      {filters}
      <div css={[tw`mt-sm flex flex-col gap-xs`]}>
        <div css={[tw`self-end`]}>
          <AddTagPopover />
        </div>
        <div>{tagsList}</div>
        <div>{articlesList}</div>
      </div>
    </div>
  );
};

const AddTagPopover = () => {
  return (
    <WithProximityPopover
      panel={({ close: closePanel }) => (
        <AddTagPanelUI addTagInput={<AddTagInput closePanel={closePanel} />} />
      )}
    >
      <AddTagButtonUI />
    </WithProximityPopover>
  );
};

const AddTagButtonUI = () => {
  return (
    <button
      css={[
        tw`-translate-y-xs cursor-pointer flex items-center gap-sm py-1 px-2 border-2 rounded-sm text-blue-500 border-blue-500`,
      ]}
    >
      <span css={[tw`text-xs uppercase font-medium`]}>Add tag</span>
      <span css={[tw`text-blue-400`]}>
        <Plus weight="bold" />
      </span>
    </button>
  );
};

const AddTagPanelUI = ({ addTagInput }: { addTagInput: ReactElement }) => {
  return (
    <div css={[s_popover.panelContainer]}>
      <h3 css={[s_popover.title]}>Add tag</h3>
      {addTagInput}
    </div>
  );
};

const addTagInputId = "new-language-input-id";

const AddTagInput = ({ closePanel }: { closePanel: () => void }) => {
  const [value, setValue] = useState("");

  const [inputIsFocused, focusHandlers] = useFocused();

  const dispatch = useDispatch();

  const entities = useSelector(selectAll);

  const existingEntitiesFormatted = entities.map((tag) =>
    tag.text.toLowerCase()
  );
  const inputValueFormatted = value.toLowerCase();
  const inputValueMatchesExistingEntity =
    existingEntitiesFormatted.includes(inputValueFormatted);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValueMatchesExistingEntity) {
      return;
    }

    dispatch(addOne({ text: value }));
    closePanel();
  };

  return (
    <form onSubmit={handleSubmit} {...focusHandlers}>
      <div css={[tw`relative inline-block`]}>
        <input
          css={[
            tw`text-gray-800 px-lg py-1 text-sm outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
            !inputIsFocused && tw`text-gray-400`,
          ]}
          id={addTagInputId}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a new tag..."
          type="text"
          autoComplete="off"
        />
        <label
          css={[
            tw`absolute left-2 top-1/2 -translate-y-1/2 text-gray-500`,
            !inputIsFocused && tw`text-gray-300`,
          ]}
          htmlFor={addTagInputId}
        >
          <Plus />
        </label>
        {inputValueMatchesExistingEntity ? (
          <WithTooltip text="tag already exists">
            <span
              css={[
                tw`absolute top-1/2 -translate-y-1/2 right-2 text-red-warning`,
                !inputIsFocused && tw`text-gray-300`,
              ]}
            >
              <Prohibit />
            </span>
          </WithTooltip>
        ) : null}
      </div>
    </form>
  );
};

const FiltersUI = ({
  search,
  usedTypeRadio,
}: {
  search: ReactElement;
  usedTypeRadio: ReactElement;
}) => {
  return (
    <div css={[tw`flex flex-col gap-sm`]}>
      <h3 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
        <span>
          <Funnel />
        </span>
        <span>Filters</span>
      </h3>
      <div css={[tw`flex flex-col gap-xs`]}>{search}</div>
      <div>{usedTypeRadio}</div>
    </div>
  );
};

const tagFilterInputId = "tag-filter-input-id";

const SearchUI = () => {
  const { searchValue, setSearchValue } = useFiltersContext();

  return (
    <div css={[tw`relative flex items-center gap-xs`]}>
      <label htmlFor={tagFilterInputId}>Tag name:</label>
      <input
        css={[
          tw`text-gray-600 text-sm focus:text-gray-800 px-xs py-1 outline-none border-2 border-transparent focus:border-gray-200 rounded-sm`,
        ]}
        id={tagFilterInputId}
        value={searchValue}
        onChange={(e) => {
          const value = e.target.value;
          setSearchValue(value);
        }}
        placeholder="tag name..."
        type="text"
        autoComplete="off"
      />
    </div>
  );
};

const UsedTypeRadio = () => {
  const { setUsedType, usedType } = useFiltersContext();

  return <UsedTypeRadioUI setValue={setUsedType} value={usedType} />;
};

const TagsList = () => {
  const allTags = useSelector(selectAll);
  const allArticles = useSelector(selectAllArticles);

  const { usedType, searchValue } = useFiltersContext();

  const usedTagsById = allArticles.flatMap((article) => article.tagIds);
  const checkTagIsUsed = (tagId: string) => usedTagsById.includes(tagId);

  const filterByUsedType = (tags: Tag[]) =>
    usedType === "all"
      ? tags
      : tags.filter((language) => {
          const isUsed = checkTagIsUsed(language.id);

          return usedType === "used" ? isUsed : !isUsed;
        });

  const filterBySearch = (tags: Tag[]) => {
    const validSearch = searchValue.length > 1;
    if (!validSearch) {
      return tags;
    }

    const result = fuzzySearchTags(searchValue, tags);

    return result;
  };

  const filteredTags = applyFilters(allTags, [
    filterByUsedType,
    filterBySearch,
  ]);

  return (
    <TagsListUI
      areTagsPostFilter={Boolean(filteredTags.length)}
      areTagsPreFilter={Boolean(allTags.length)}
      tags={
        <>
          {filteredTags.map((tag, i) => (
            <ListTagUI
              number={i + 1}
              tagMenu={
                <TagMenuUI
                  articlesButton={<TagArticlesPopover tagId={tag.id} />}
                  deleteButton={<DeleteTag tagId={tag.id} />}
                />
              }
              tagText={<TagTextInput tag={tag} />}
              key={tag.id}
            />
          ))}
        </>
      }
    />
  );
};

const TagsListUI = ({
  tags,
  areTagsPostFilter,
  areTagsPreFilter,
}: {
  tags: ReactElement;
  areTagsPreFilter: boolean;
  areTagsPostFilter: boolean;
}) => {
  return (
    <div>
      <h3 css={[tw`font-medium text-xl flex items-center gap-xs`]}>
        <span>Tags</span>
        <span>
          <GitBranch />
        </span>
      </h3>
      {!areTagsPreFilter ? (
        <p css={[tw`mt-xs text-gray-700 text-sm`]}>No tags yet</p>
      ) : areTagsPostFilter ? (
        <div css={[tw`flex flex-col gap-md mt-sm`]}>{tags}</div>
      ) : (
        <p>No tags for filter</p>
      )}
    </div>
  );
};

const ListTagUI = ({
  number,
  tagText,
  tagMenu,
}: {
  number: number;
  tagText: ReactElement;
  tagMenu: ReactElement;
}) => {
  return (
    <div css={[tw`flex gap-sm`]} className="group">
      <div css={[tw`flex gap-sm`]}>
        <div css={[tw`text-gray-600 w-[20px]`]}>{number}.</div>
        <p>{tagText}</p>
      </div>
      <div css={[tw`ml-lg grid place-items-center`]}>{tagMenu}</div>
    </div>
  );
};

const TagTextInput = ({ tag }: { tag: Tag }) => {
  const { id, text } = tag;
  const dispatch = useDispatch();

  return (
    <WithTooltip text="edit tag text" type="action" placement="top">
      <div>
        <InlineTextEditor
          injectedValue={text}
          onUpdate={(text) => dispatch(updateText({ id, text }))}
          placeholder="tag..."
        >
          {({ isFocused: isEditing }) => (
            <>
              {!text.length && !isEditing ? (
                <MissingText tooltipText="missing tag text" />
              ) : null}
            </>
          )}
        </InlineTextEditor>
      </div>
    </WithTooltip>
  );
};

const TagMenuUI = ({
  deleteButton,
  articlesButton,
}: {
  deleteButton: ReactElement;
  articlesButton: ReactElement;
}) => {
  return (
    <menu css={[s_transition.onGroupHover, tw`flex items-center gap-sm`]}>
      {articlesButton}
      {deleteButton}
    </menu>
  );
};

const TagArticlesPopover = ({ tagId }: { tagId: string }) => {
  const tagArticles = useTagArticles(tagId);

  return (
    <WithRelatedArticles
      articles={tagArticles}
      subTitleText={{
        noArticles: "This tag is unconnected to any articles.",
        withArticles: "Articles this tag is connected to.",
      }}
      title="Tag articles"
    >
      <TagArticlesButtonUI />
    </WithRelatedArticles>
  );
};

const TagArticlesButtonUI = () => {
  return (
    <WithTooltip text="tag articles">
      <button
        css={[
          s_editorMenu.button,
          tw`relative text-gray-500 hover:text-gray-700`,
        ]}
        type="button"
      >
        <ArticleIcon />
      </button>
    </WithTooltip>
  );
};

const DeleteTag = ({ tagId }: { tagId: string }) => {
  const dispatch = useDispatch();
  const tagArticles = useTagArticles(tagId);

  const handleDeleteTag = () => {
    for (let i = 0; i < tagArticles.length; i++) {
      const article = tagArticles[i];
      dispatch(removeTagFromArticle({ id: article.id, tagId }));
    }
    dispatch(deleteTag({ id: tagId }));
  };

  return <DeleteTagUI deleteTag={handleDeleteTag} />;
};

const DeleteTagUI = ({ deleteTag }: { deleteTag: () => void }) => {
  return (
    <WithWarning
      warningText={{
        heading: "Delete tag?",
        body: "This will affect all documents this tag is connected to.",
      }}
      callbackToConfirm={deleteTag}
    >
      <WithTooltip text="delete tag" type="action">
        <button
          css={[tw`text-gray-400 hover:text-red-warning flex items-center`]}
          type="button"
        >
          <Trash />
        </button>
      </WithTooltip>
    </WithWarning>
  );
};

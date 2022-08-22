import {
  createContext,
  FormEvent,
  ReactElement,
  useContext,
  useState,
} from "react";
import tw from "twin.macro";
import { FilePlus, Plus, FileMinus, WarningCircle } from "phosphor-react";
import { v4 as generateUId } from "uuid";

import { useSelector, useDispatch } from "^redux/hooks";
import {
  selectAll,
  selectById as selectTagById,
  selectEntitiesByIds,
  addOne,
} from "^redux/state/tags";

import { TagProvider, useTagContext } from "^context/tags/TagContext";

import { checkObjectHasField, fuzzySearch } from "^helpers/general";

import useFocused from "^hooks/useFocused";

import WithProximityPopover from "./WithProximityPopover";
import WithTooltip from "./WithTooltip";
import WithWarning from "./WithWarning";

import s_transition from "^styles/transition";
import { s_popover } from "^styles/popover";
import ContentMenu from "./menus/Content";

export type Props = {
  docTagsById: string[];
  docType: string;
  onAddToDoc: (tagId: string) => void;
  onRemoveFromDoc: (tagId: string) => void;
};

type Value = Props;
const Context = createContext<Value>({} as Value);

const Provider = ({
  children,
  ...value
}: { children: ReactElement } & Value) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};

const useWithTagsContext = () => {
  const context = useContext(Context);
  const contextIsPopulated = checkObjectHasField(context);
  if (!contextIsPopulated) {
    throw new Error("useWithTagsContext must be used within its provider!");
  }
  return context;
};

const WithTags = ({
  children,
  ...topProps
}: { children: ReactElement } & Props) => {
  return (
    <WithProximityPopover
      panel={
        <Provider {...topProps}>
          <Panel />
        </Provider>
      }
    >
      {children}
    </WithProximityPopover>
  );
};

export default WithTags;

const Panel = () => {
  const { docTagsById, docType } = useWithTagsContext();

  return <PanelUI areDocTags={Boolean(docTagsById.length)} docType={docType} />;
};

const PanelUI = ({
  areDocTags,
  docType,
}: {
  areDocTags: boolean;
  docType: string;
}) => (
  <div css={[s_popover.panelContainer, tw`w-[90ch]`]}>
    <div>
      <h4 css={[tw`font-medium text-lg`]}>Tags</h4>
      <p css={[tw`text-gray-600 mt-xs text-sm`]}>
        Tags allow all documents, such as articles and videos, to be narrowly
        categorised on the website, mainly for search purposes. They can be
        broad, e.g. politics, or narrow, e.g. fraud and oil. Documents can have
        many tags.
      </p>
      {!areDocTags ? (
        <p css={[tw`text-gray-800 mt-xs text-sm`]}>
          This {docType} isn&apos;t related to any tags yet.
        </p>
      ) : (
        <p css={[tw`mt-md text-sm `]}>
          This {docType} is related to the following tag(s):
        </p>
      )}
    </div>
    <div css={[tw`flex flex-col gap-lg items-start`]}>
      {areDocTags ? <List /> : null}
      <InputWithSelect />
    </div>
  </div>
);

const List = () => {
  const { docTagsById } = useWithTagsContext();

  return (
    <ListUI
      listItems={docTagsById.map((docTagId, i) => (
        <ListItem docTagId={docTagId} index={i} key={docTagId} />
      ))}
    />
  );
};

const ListUI = ({ listItems }: { listItems: ReactElement[] }) => (
  <div css={[tw`flex flex-col gap-xs`]}>{listItems}</div>
);

const ListItem = ({ docTagId, index }: { docTagId: string; index: number }) => {
  const number = index + 1;

  return (
    <ListItemUI
      handleCollectionValidity={<HandleTagValidity docTagId={docTagId} />}
      number={number}
    />
  );
};

const ListItemUI = ({
  handleCollectionValidity,
  number,
}: {
  handleCollectionValidity: ReactElement;
  number: number;
}) => {
  return (
    <div css={[tw`relative flex`]} className="group">
      <span css={[tw`text-gray-600 mr-sm`]}>{number}.</span>
      {handleCollectionValidity}
    </div>
  );
};

const HandleTagValidity = ({ docTagId }: { docTagId: string }) => {
  const tag = useSelector((state) => selectTagById(state, docTagId));

  return tag ? (
    <TagProvider tag={tag}>
      <ValidTag />
    </TagProvider>
  ) : (
    <InvalidTagUI
      removeFromDocButton={<RemoveFromDocButton docTagId={docTagId} />}
    />
  );
};

const InvalidTagUI = ({
  removeFromDocButton,
}: {
  removeFromDocButton: ReactElement;
}) => (
  <div css={[tw`flex items-center gap-sm`]}>
    {removeFromDocButton}
    <WithTooltip
      text={{
        header: "Tag error",
        body: "A tag was added to this document that can't be found. Try refreshing the page. If the problem persists, contact the site developer.",
      }}
    >
      <span css={[tw`text-red-500 bg-white group-hover:z-50`]}>
        <WarningCircle />
      </span>
    </WithTooltip>
  </div>
);

const RemoveFromDocButton = ({ docTagId }: { docTagId: string }) => {
  const { onRemoveFromDoc } = useWithTagsContext();

  const removeFromDoc = () => onRemoveFromDoc(docTagId);

  return (
    <RemoveFromDocButtonUI
      removeFromDoc={removeFromDoc}
      tooltipText="remove tag from document"
      warningText="Remove tag from document?"
    />
  );
};

const RemoveFromDocButtonUI = ({
  removeFromDoc,
  tooltipText,
  warningText,
}: {
  removeFromDoc: () => void;
  tooltipText: string;
  warningText: string;
}) => (
  <WithWarning
    callbackToConfirm={removeFromDoc}
    warningText={{ heading: warningText }}
    type="moderate"
  >
    {({ isOpen: warningIsOpen }) => (
      <ContentMenu.Button
        tooltipProps={{
          isDisabled: warningIsOpen,
          placement: "top",
          text: tooltipText,
          type: "action",
        }}
      >
        <FileMinus />
      </ContentMenu.Button>
    )}
  </WithWarning>
);

const ValidTag = () => {
  return <ValidTagUI />;
};

const ValidTagUI = () => (
  <div css={[tw`flex gap-sm`]} className="group">
    <div
      css={[
        tw`opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in delay-300`,
      ]}
    >
      <ValidCollectionMenu />
    </div>
    <div
      css={[
        tw`translate-x-[-40px] group-hover:z-40 group-hover:translate-x-0 transition-transform duration-150 ease-in delay-300`,
      ]}
    >
      <TagText />
    </div>
  </div>
);

const ValidCollectionMenu = () => {
  const [{ id }] = useTagContext();

  return (
    <ValidCollectionMenuUI
      removeFromDocButton={<RemoveFromDocButton docTagId={id} />}
    />
  );
};

const ValidCollectionMenuUI = ({
  removeFromDocButton,
}: {
  removeFromDocButton: ReactElement;
}) => (
  <div css={[tw`flex items-center gap-xs`]}>
    {removeFromDocButton}
    <div css={[tw`w-[0.5px] h-[15px] bg-gray-400`]} />
  </div>
);

const TagText = () => {
  const [{ text }] = useTagContext();

  return <TagTextUI text={text} />;
};

const TagTextUI = ({ text }: { text: string }) => <div>{text}</div>;

const inputId = "tags-input";

const InputWithSelect = () => {
  const [inputValue, setInputValue] = useState("");

  const [inputIsFocused, focusHandlers] = useFocused();

  const { docTagsById, onAddToDoc } = useWithTagsContext();

  const allTags = useSelector(selectAll);
  const docTags = useSelector((state) =>
    selectEntitiesByIds(state, docTagsById)
  );
  const docTagsText = docTags.map((t) => t?.text);

  const inputValueIsDocTag = docTagsText.includes(inputValue);

  const dispatch = useDispatch();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValueIsDocTag) {
      return;
    }

    const existingTag = allTags.find((t) => t.text === inputValue);

    if (existingTag) {
      onAddToDoc(existingTag.id);
    } else {
      const id = generateUId();
      dispatch(addOne({ id, text: inputValue }));
      onAddToDoc(id);
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
            placeholder="Add a new tag..."
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
        onAddToDoc={(tagId) => {
          onAddToDoc(tagId);
          setInputValue("");
        }}
        query={inputValue}
        show={inputIsFocused && inputValue.length > 1}
      />
    </div>
  );
};

const TagsSelect = ({
  onAddToDoc,
  query,
  show,
}: {
  onAddToDoc: (tagId: string) => void;
  query: string;
  show: boolean;
}) => {
  const { docTagsById, docType } = useWithTagsContext();

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
            const isDocTag = docTagsById.includes(tag.id);
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
                    onAddToDoc(tag.id);
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

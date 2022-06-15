import { FormEvent, ReactElement, useState } from "react";
import tw from "twin.macro";
import { FilePlus, Plus, FileMinus, WarningCircle } from "phosphor-react";
import { v4 as generateUId } from "uuid";

import { useSelector, useDispatch } from "^redux/hooks";
import { selectAll, selectEntitiesByIds, addOne } from "^redux/state/tags";

import { fuzzySearch } from "^helpers/general";

import useFocused from "^hooks/useFocused";

import { Tag } from "^types/tag";

import WithProximityPopover from "./WithProximityPopover";
import WithTooltip from "./WithTooltip";
import WithWarning from "./WithWarning";

import s_transition from "^styles/transition";
import { s_popover } from "^styles/popover";

type Props = {
  children: ReactElement;
  onRemoveFromDoc: (tagId: string) => void;
} & TagsInputWithSelectProps;

const WithTags = ({ children, ...passedProps }: Props) => {
  return (
    <WithProximityPopover panelContentElement={<Panel {...passedProps} />}>
      {children}
    </WithProximityPopover>
  );
};

export default WithTags;

//todo: edit tags popup to edit all tags
//todo: subtitle text. explain what tags are.
//todo: smaller warning for certain actions

const Panel = ({
  docType,
  onRemoveFromDoc,
  ...passedProps
}: {
  onRemoveFromDoc: (tagId: string) => void;
} & TagsInputWithSelectProps) => {
  const { docTagIds } = passedProps;

  const docTags = useSelector((state) => selectEntitiesByIds(state, docTagIds));
  const areDocTags = docTags.length;

  return (
    <div css={[s_popover.container]}>
      <div>
        <h4 css={[tw`font-medium text-lg`]}>Tags</h4>
        <p css={[tw`text-gray-600 mt-xs text-sm`]}>
          {!areDocTags
            ? "You haven't added any tags to this article yet."
            : "Tags allow all documents, such as articles and videos, to be categorised on the website."}
        </p>
      </div>
      <div css={[tw`flex flex-col gap-md items-start`]}>
        {areDocTags ? (
          <div css={[tw`flex flex-col gap-xxs`]}>
            {docTags.map((tag, i) => (
              <DocTag
                docType={docType}
                number={i}
                onRemoveFromDoc={onRemoveFromDoc}
                tag={tag}
                key={tag.id}
              />
            ))}
          </div>
        ) : null}
        <TagsInputWithSelect docType={docType} {...passedProps} />
      </div>
    </div>
  );
};

type DocTagProps = {
  docType: string;
  onRemoveFromDoc: (tagId: string) => void;
  number: number;
  tag: Tag;
};

const DocTag = ({ docType, tag, onRemoveFromDoc, number }: DocTagProps) => {
  return (
    <div css={[tw`relative flex items-center`]} className="group" key={tag.id}>
      <span css={[tw`text-gray-700 w-[25px]`]}>{number + 1}.</span>
      <span>{tag.text}</span>
      <WithWarning
        callbackToConfirm={() => onRemoveFromDoc(tag.id)}
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
              <FileMinus />
            </button>
          </WithTooltip>
        )}
      </WithWarning>
    </div>
  );
};

const inputId = "tags-input";

type TagsInputWithSelectProps = {
  docTagIds: string[];
  docType: string;
  onSubmit: (tagId: string) => void;
};

const TagsInputWithSelect = ({
  docTagIds,
  onSubmit,
  docType,
}: TagsInputWithSelectProps) => {
  const [inputValue, setInputValue] = useState("");

  const [inputIsFocused, focusHandlers] = useFocused();

  const allTags = useSelector(selectAll);
  const docTags = useSelector((state) => selectEntitiesByIds(state, docTagIds));
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
        docTagIds={docTagIds}
        docType={docType}
        onSubmit={(languageId) => {
          onSubmit(languageId);
          setInputValue("");
        }}
        query={inputValue}
        show={inputIsFocused && inputValue.length > 1}
      />
    </div>
  );
};

const TagsSelect = ({
  docTagIds,
  docType,
  onSubmit,
  query,
  show,
}: TagsInputWithSelectProps & { query: string; show: boolean }) => {
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

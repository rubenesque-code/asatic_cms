import { FormEvent, useState } from "react";
import tw, { css } from "twin.macro";
import { v4 as generateUId } from "uuid";
import { FilePlus, Plus } from "phosphor-react";

import { useDispatch, useSelector } from "^redux/hooks";

import { addOne, selectAll, selectEntitiesByIds } from "^redux/state/tags";

import { fuzzySearch } from "^helpers/general";
import useFocused from "^hooks/useFocused";

import WithTooltip from "./WithTooltip";
import WithProximityPopover from "./WithProximityPopover";

import s_input from "^styles/input";
import s_button from "^styles/button";
import s_transition from "^styles/transition";

type PanelProps = {
  docTagIds: string[];
  docType: "article";
  onAddTag: (tagId: string) => void;
};

const AddTag = (panelProps: PanelProps) => {
  return (
    <WithProximityPopover panelContentElement={<AddTagPanel {...panelProps} />}>
      <div css={[tw`grid place-items-center px-sm`]}>
        <WithTooltip text="add tag" yOffset={10}>
          <button
            css={[tw`p-xxs rounded-full hover:bg-gray-100 active:bg-gray-200`]}
            type="button"
          >
            <Plus weight="bold" />
          </button>
        </WithTooltip>
      </div>
    </WithProximityPopover>
  );
};

export default AddTag;

const AddTagPanel = ({ docTagIds, docType, onAddTag }: PanelProps) => {
  const [inputValue, setInputValue] = useState("");
  const inputValueFormatted = inputValue.toLowerCase();
  const [inputIsFocused, focusHandlers] = useFocused();

  const dispatch = useDispatch();

  const allTags = useSelector(selectAll);
  const docTags = useSelector((state) => selectEntitiesByIds(state, docTagIds));

  const filteredTags = fuzzySearch(["text"], allTags, inputValueFormatted).map(
    (f) => f.item
  );

  const allTagsText = allTags.map((t) => t.text);
  const inputValueIsTag = allTagsText.includes(inputValueFormatted);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const docTagsText = docTags.map((t) => t?.text);
    const inputValueIsDocTag = docTagsText.includes(inputValueFormatted);

    if (inputValueIsDocTag) {
      return;
    }

    if (inputValueIsTag) {
      const tagId = allTags.find((t) => t.text === inputValueFormatted)!.id;
      onAddTag(tagId);
    } else {
      const id = generateUId();
      dispatch(addOne({ id, text: inputValueFormatted }));
      onAddTag(id);
      setInputValue("");
    }
  };

  return (
    <div css={[tw`p-lg min-w-[35ch] flex flex-col gap-md`]}>
      <h3 css={[tw`font-medium text-lg`]}>Add tag</h3>
      <div className="group" css={[tw`relative `]}>
        <form
          css={[tw`relative flex gap-sm items-center`]}
          onSubmit={handleSubmit}
        >
          <input
            css={[
              s_input.input,
              s_input.transition,
              s_input.focused,
              tw`border-gray-100 border px-2 py-1`,
            ]}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for or enter new tag"
            type="text"
            value={inputValue}
            {...focusHandlers}
          />
          <p
            css={[
              s_transition.toggleVisiblity(
                Boolean(inputValueFormatted.length && inputIsFocused)
              ),
              s_input.transition,
              tw`z-10 absolute left-1 top-0 -translate-y-1/2 bg-white rounded-sm uppercase text-xs text-gray-400`,
            ]}
          >
            Create new tag
          </p>
          {/*           {inputValueFormatted.length ? (
            <WithTooltip text={`Create new tag and add to ${docType}`}>
              <button
                css={[
                  s.addTagButtonIcon,
                  tw`absolute right-2 top-1/2 -translate-y-1/2`,
                ]}
                type="submit"
              >
                <FilePlus />
              </button>
            </WithTooltip>
          ) : null} */}
        </form>
        <div
          css={[
            s_transition.toggleVisiblity(
              Boolean(inputValueFormatted.length && inputIsFocused)
            ),
            s_input.transition,
            tw`absolute bottom-0 translate-y-full border flex flex-col gap-xs bg-white w-full p-md`,
          ]}
        >
          <h4 css={[tw`text-gray-400 uppercase text-xs`]}>Add existing tag</h4>
          {filteredTags.length ? (
            filteredTags.map((tag) => {
              const isDocTag = docTagIds.includes(tag.id);
              return (
                <div
                  css={[
                    tw`flex justify-between items-center`,
                    isDocTag && tw`pointer-events-none opacity-40`,
                  ]}
                  key={tag.id}
                >
                  <p>{tag.text}</p>
                  <WithTooltip text={`Add tag to ${docType}`}>
                    <button css={[s.addTagButtonIcon]} type="button">
                      <FilePlus />
                    </button>
                  </WithTooltip>
                </div>
              );
            })
          ) : (
            <p>- no matches -</p>
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  addTagButtonIcon: css`
    ${s_button.icon} ${s_button.selectors} ${tw`text-base text-gray-600`}
  `,
};

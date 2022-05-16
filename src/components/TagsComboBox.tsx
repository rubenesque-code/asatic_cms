import { FormEvent, useState } from "react";
import tw from "twin.macro";
import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";

import { addOne, selectAll, selectEntitiesByIds } from "^redux/state/tags";

import { fuzzySearch } from "^helpers/general";
import s_input from "^styles/input";
import WithTooltip from "./WithTooltip";
import { FilePlus } from "phosphor-react";
import s_button from "^styles/button";
import useFocused from "^hooks/useFocused";
import s_transition from "^styles/transition";
// import { Tag } from "^types/tag";

// todo: maybe use headless ui popover with manual show

const TagsComboBox = ({
  docTagIds,
  docType,
  onAddTag,
}: {
  docTagIds: string[];
  docType: "article";
  onAddTag: (tagId: string) => void;
}) => {
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");
  const inputValueFormatted = inputValue.toLowerCase();

  const [inputIsFocused, focusHandlers] = useFocused();

  const allTags = useSelector(selectAll);
  const docTags = useSelector((state) => selectEntitiesByIds(state, docTagIds));
  // const allTagsText = allTags.map(t => t.text)
  // const nonDocTagsIds = allTagsIds.filter(id => !docTagIds.includes(id))
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
    }
  };

  return (
    <div className="group" css={[tw`relative`]}>
      <form
        css={[tw`relative flex gap-sm items-center`]}
        onSubmit={handleSubmit}
      >
        <input
          css={[
            s_input.input,
            s_input.transition,
            s_input.focused,
            s_input.unFocused,
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
        {inputValueFormatted.length ? (
          <WithTooltip text={`Create new tag and add to ${docType}`}>
            <button
              css={[
                s_button.icon,
                s_button.selectors,
                tw`absolute right-1 top-1/2 -translate-y-1/2`,
              ]}
              type="submit"
            >
              <FilePlus />
            </button>
          </WithTooltip>
        ) : null}
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
          <div>
            {filteredTags.map((tag) => (
              <div key={tag.id}>
                <button type="button">{tag.text}</button>
              </div>
            ))}
          </div>
        ) : (
          <p>- no matches -</p>
        )}
      </div>
    </div>
  );
};

export default TagsComboBox;

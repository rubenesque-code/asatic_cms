import { Combobox } from "@headlessui/react";
import { SetStateAction, useState } from "react";
import { useSelector } from "^redux/hooks";
import { selectAll } from "^redux/state/tags";
import { Tag } from "^types/tag";

const TagsComboBox = ({
  docTagIds,
  onAddTag,
}: {
  docTagIds: string[];
  onAddTag: (tagId: string) => void;
}) => {
  const [query, setQuery] = useState("");

  const allTags = useSelector(selectAll);

  return (
    <Combobox value="hello" onChange={() => null}>
      <Combobox.Input
        onChange={(e: { target: { value: string } }) =>
          setQuery(e.target.value)
        }
      />
      <Combobox.Options>
        <Combobox.Option value="hello">
          Search for or add new tag
        </Combobox.Option>
        <Combobox.Option
          onClick={() => {
            onAddTag("tag1");
            setQuery("");
          }}
          value="tag1"
        >
          Tag 1
        </Combobox.Option>
      </Combobox.Options>
    </Combobox>
  );
};

export default TagsComboBox;

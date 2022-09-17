import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";
import { addOne as addTag, selectTags } from "^redux/state/tags";

import InputSelectCombo from "^components/InputSelectCombo";

import DocTagsPanel from ".";
import PanelUI from "../../PanelUI";

import SelectEntityUI from "^components/secondary-content-popovers/SelectEntityUI";
import { fuzzySearchTags } from "^helpers/tags";
import { Tag } from "^types/tag";

const DocTagsInputSelectCombo = () => {
  return (
    <PanelUI.InputSelectCombo>
      <InputSelectCombo>
        <>
          <Input />
          <Select />
        </>
      </InputSelectCombo>
    </PanelUI.InputSelectCombo>
  );
};

export default DocTagsInputSelectCombo;

const Input = () => {
  const { addTagToDoc: addTagToDoc } = DocTagsPanel.useContext();
  const { inputValue, setInputValue } = InputSelectCombo.useContext();

  const dispatch = useDispatch();

  const submitNewTagToDoc = () => {
    const id = generateUId();
    dispatch(addTag({ id, text: inputValue }));
    addTagToDoc(id);
    setInputValue("");
  };

  return (
    <InputSelectCombo.Input
      placeholder="Add a new tag..."
      onSubmit={() => {
        submitNewTagToDoc();
      }}
    />
  );
};

const Select = () => {
  const allTags = useSelector(selectTags);

  const { inputValue } = InputSelectCombo.useContext();

  const tagsMatchingQuery = fuzzySearchTags(inputValue, allTags);

  return (
    <InputSelectCombo.Select>
      {tagsMatchingQuery.map((tag) => (
        <SelectTag tag={tag} key={tag.id} />
      ))}
    </InputSelectCombo.Select>
  );
};

const SelectTag = ({ tag: tag }: { tag: Tag }) => {
  const { addTagToDoc: addTagToDoc, docTagsIds: docTagsIds } =
    DocTagsPanel.useContext();

  const canAddToDoc = !docTagsIds.includes(tag.id);

  return (
    <SelectEntityUI
      addToDoc={() => addTagToDoc(tag.id)}
      canAddToDoc={canAddToDoc}
    >
      <span>{tag.text}</span>
    </SelectEntityUI>
  );
};

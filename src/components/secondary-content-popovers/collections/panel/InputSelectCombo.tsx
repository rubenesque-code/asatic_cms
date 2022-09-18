import { v4 as generateUId } from "uuid";

import { useDispatch, useSelector } from "^redux/hooks";
import {
  addOne as addCollection,
  selectCollections,
} from "^redux/state/collections";

import { fuzzySearchCollections } from "^helpers/collections";

import { Collection as CollectionType } from "^types/collection";

import InputSelectCombo from "^components/InputSelectCombo";

import DocCollectionsPanel from ".";
import PanelUI from "../../PanelUI";

import SelectEntityUI from "^components/secondary-content-popovers/SelectEntityUI";

const DocCollectionsInputSelectCombo = () => {
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

export default DocCollectionsInputSelectCombo;

const Input = () => {
  const { addCollectionToDoc, docActiveLanguageId } =
    DocCollectionsPanel.useContext();
  const { inputValue, setInputValue } = InputSelectCombo.useContext();

  const dispatch = useDispatch();

  const handleAddNewCollectionToDoc = () => {
    const id = generateUId();
    dispatch(
      addCollection({ id, title: inputValue, languageId: docActiveLanguageId })
    );
    addCollectionToDoc(id);
    setInputValue("");
  };

  return (
    <InputSelectCombo.Input
      placeholder="Add a new collection..."
      onSubmit={handleAddNewCollectionToDoc}
    />
  );
};

const Select = () => {
  const allCollections = useSelector(selectCollections);

  const { inputValue } = InputSelectCombo.useContext();

  const collectionsMatchingQuery = fuzzySearchCollections(
    inputValue,
    allCollections
  );

  return (
    <InputSelectCombo.Select>
      {collectionsMatchingQuery.map((collection) => (
        <SelectCollection collection={collection} key={collection.id} />
      ))}
    </InputSelectCombo.Select>
  );
};

const SelectCollection = ({
  collection: collection,
}: {
  collection: CollectionType;
}) => {
  const { addCollectionToDoc, docCollectionsIds } =
    DocCollectionsPanel.useContext();

  const canAddToDoc = !docCollectionsIds.includes(collection.id);

  return (
    <SelectEntityUI
      addToDoc={() => addCollectionToDoc(collection.id)}
      canAddToDoc={canAddToDoc}
    >
      {collection.translations
        .filter((translation) => translation.title.length)
        .map((translation, i) => (
          <SelectEntityUI.Translation
            id={translation.id}
            index={i}
            text={translation.title}
            key={translation.id}
          />
        ))}
    </SelectEntityUI>
  );
};

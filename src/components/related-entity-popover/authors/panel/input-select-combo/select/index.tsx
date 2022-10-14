import { useSelector } from "^redux/hooks";

import InputSelectCombo from "^components/InputSelectCombo";
import Item from "./item";

import { $Container } from "^components/related-entity-popover/_styles/selectEntities";
import { selectTotalAuthors } from "^redux/state/authors";
import useAuthorsFuzzySearch from "^hooks/authors/useFuzzySearch";
import { useComponentContext } from "../../../Context";
import AuthorSlice from "^context/authors/AuthorContext";

const Select = () => {
  const { inputValue: query } = InputSelectCombo.useContext();

  const [{ parentAuthorsIds }] = useComponentContext();

  const numAuthors = useSelector(selectTotalAuthors);
  const queryItems = useAuthorsFuzzySearch({
    query,
    unwantedIds: parentAuthorsIds,
  });

  return (
    <InputSelectCombo.Select
      show={Boolean(numAuthors)}
      isMatch={Boolean(queryItems.length)}
    >
      <$Container>
        {queryItems.map((author) => (
          <AuthorSlice.Provider author={author} key={author.id}>
            <Item />
          </AuthorSlice.Provider>
        ))}
      </$Container>
    </InputSelectCombo.Select>
  );
};

export default Select;

import { useSelector } from "^redux/hooks";
import { selectAuthors } from "^redux/state/authors";

import useAuthorsFuzzySearch from "^hooks/authors/useFuzzySearch";

import AuthorSlice from "^context/authors/AuthorContext";
import { useComponentContext } from "../../../Context";

import { arrayDivergence, mapIds } from "^helpers/general";

import InputSelectCombo from "^components/InputSelectCombo";
import Item from "./Item";
import { $Container } from "^components/rich-popover/_styles/selectEntities";

const Select = () => {
  const { inputValue: query } = InputSelectCombo.useContext();

  const { parentEntityData } = useComponentContext();

  const excludedAuthorsIds = parentEntityData.authorsIds;

  const queryItems = useAuthorsFuzzySearch({
    query,
    unwantedIds: excludedAuthorsIds,
  });

  const allAuthors = useSelector(selectAuthors);
  const isUnusedAuthor = Boolean(
    arrayDivergence(mapIds(allAuthors), excludedAuthorsIds).length
  );

  return (
    <InputSelectCombo.Select
      isItem={isUnusedAuthor}
      isMatch={Boolean(queryItems.length)}
      entityName="author"
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

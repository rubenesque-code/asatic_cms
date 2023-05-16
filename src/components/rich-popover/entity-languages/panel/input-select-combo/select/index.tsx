import { useSelector } from "^redux/hooks";
import { selectLanguages } from "^redux/state/languages";

import { useComponentContext } from "../../../Context";

import useLanguagesFuzzySearch from "^hooks/languages/useFuzzySearch";

import { arrayDivergence, mapIds } from "^helpers/general";

import InputSelectCombo from "^components/InputSelectCombo";
import Item from "./Item";
import { $Container } from "^components/rich-popover/_styles/selectEntities";

const Select = () => {
  const { inputValue: query } = InputSelectCombo.useContext();

  const { parentEntity } = useComponentContext();

  const excludedLanguageIds = parentEntity.languagesIds;

  const queryItems = useLanguagesFuzzySearch({
    query,
    excludedIds: excludedLanguageIds,
  });

  const allLanguages = useSelector(selectLanguages);
  const isUnusedAuthor = Boolean(
    arrayDivergence(mapIds(allLanguages), excludedLanguageIds).length
  );

  return (
    <InputSelectCombo.Select
      isItem={isUnusedAuthor}
      isMatch={Boolean(queryItems.length)}
      entityName="author"
    >
      <$Container>
        {queryItems.map((language) => (
          <Item language={language} key={language.id} />
        ))}
      </$Container>
    </InputSelectCombo.Select>
  );
};

export default Select;

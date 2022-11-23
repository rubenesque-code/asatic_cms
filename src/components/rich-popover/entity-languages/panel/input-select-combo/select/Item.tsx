import { useComponentContext } from "../../../Context";

import { Language } from "^types/language";

import { $SelectEntity_ } from "^components/rich-popover/_presentation/SelectEntities";
import { $TranslationText as $Text } from "^components/rich-popover/_styles/selectEntities";

const Item = ({ language }: { language: Language }) => {
  const { parentEntity } = useComponentContext();

  return (
    <$SelectEntity_
      addEntityToParent={() => parentEntity.addTranslation(language.id)}
      entityType="language"
      parentType={parentEntity.name}
    >
      {["_"].map((_, i) => (
        <$Text key={i}>{language.name}</$Text>
      ))}
    </$SelectEntity_>
  );
};

export default Item;

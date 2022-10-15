import AuthorSlice from "^context/authors/AuthorContext";
import { useComponentContext } from "../../../Context";

import { $SelectEntity_ } from "^components/related-entity-popover/_presentation/SelectEntities";
import { Translation_ } from "^components/related-entity-popover/_containers/SelectEntity";

const Item = () => {
  const [{ parentType }, { addAuthorToParent }] = useComponentContext();
  const [{ id: authorId, translations }] = AuthorSlice.useContext();

  const processed = translations.filter((t) => t.name.length);

  return (
    <$SelectEntity_
      addEntityToParent={() => addAuthorToParent(authorId)}
      entityType="author"
      parentType={parentType}
    >
      {processed.map((translation) => (
        <Translation_
          languageId={translation.languageId}
          text={translation.name}
          key={translation.id}
        />
      ))}
    </$SelectEntity_>
  );
};

export default Item;

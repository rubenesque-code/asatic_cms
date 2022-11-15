import AuthorSlice from "^context/authors/AuthorContext";
import { useComponentContext } from "../../../Context";

import { $SelectEntity_ } from "^components/rich-popover/_presentation/SelectEntities";
import { Translation_ } from "^components/rich-popover/_containers/SelectEntity";

const Item = () => {
  const { parentEntityData, addAuthorRelations } = useComponentContext();
  const [{ id: authorId, translations }] = AuthorSlice.useContext();

  const processed = translations.filter((t) => t.name?.length);

  return (
    <$SelectEntity_
      addEntityToParent={() => addAuthorRelations(authorId)}
      entityType="author"
      parentType={parentEntityData.name}
    >
      {processed.map((translation) => (
        <Translation_
          languageId={translation.languageId}
          text={translation.name!}
          key={translation.id}
        />
      ))}
    </$SelectEntity_>
  );
};

export default Item;

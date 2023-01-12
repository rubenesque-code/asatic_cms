import SubjectSlice from "^context/subjects/SubjectContext";
import { useSelector } from "^redux/hooks";
import { selectArticleById } from "^redux/state/articles";
import { selectBlogById } from "^redux/state/blogs";

import { SubjectDisplayEntity } from "^types/subject";

import { EntityMenu_ } from "./_container";
import { $MissingDisplayEntity_, $EntityContainer_ } from "./_presentation";

import Article from "./article";
import Blog from "./blog";
import { EntityNameSubSet } from "^types/entity";

const Entity = ({
  entity,
}: {
  entity: {
    name: EntityNameSubSet<"article" | "blog" | "recordedEvent">;
    id: string;
  };
}) => {
  const storeEntity = useSelector((state) =>
    entity.name === "article"
      ? selectArticleById(state, entity.id)
      : selectBlogById(state, entity.id)
  );

  return (
    <$EntityContainer_>
      {(containerIsHovered) =>
        !storeEntity ? (
          <MissingEntity
            containerIsHovered={containerIsHovered}
            entity={entity}
          />
        ) : storeEntity.type === "article" ? (
          <Article
            article={storeEntity}
            containerIsHovered={containerIsHovered}
          />
        ) : (
          <Blog blog={storeEntity} containerIsHovered={containerIsHovered} />
        )
      }
    </$EntityContainer_>
  );
};

export default Entity;

const MissingEntity = ({
  entity,
  containerIsHovered,
}: {
  entity: { id: string; name: SubjectDisplayEntity };
  containerIsHovered: boolean;
}) => (
  <>
    <$MissingDisplayEntity_ entityName={entity.name} />
    <MissingEntityMenu entity={entity} isShowing={containerIsHovered} />
  </>
);

const MissingEntityMenu = ({
  entity,
  isShowing,
}: {
  entity: { id: string; name: SubjectDisplayEntity };
  isShowing: boolean;
}) => {
  const [, { removeRelatedEntity }] = SubjectSlice.useContext();

  return (
    <EntityMenu_
      isShowing={isShowing}
      removeEntity={() => removeRelatedEntity({ relatedEntity: entity })}
    />
  );
};

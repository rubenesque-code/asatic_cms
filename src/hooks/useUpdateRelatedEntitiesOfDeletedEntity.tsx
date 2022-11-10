import { useDispatch } from "^redux/hooks";
import { removeRelatedEntity as removeRelatedEntityFromAuthor } from "^redux/state/authors";
import { removeRelatedEntity as removeRelatedEntityFromCollection } from "^redux/state/collections";
import { removeRelatedEntity as removeRelatedEntityFromSubject } from "^redux/state/subjects";
import { removeRelatedEntity as removeRelatedEntityFromTag } from "^redux/state/tags";
import { removeRelatedEntity as removeRelatedEntityFromArticle } from "^redux/state/articles";
import { removeRelatedEntity as removeRelatedEntityFromBlog } from "^redux/state/blogs";
import { removeRelatedEntity as removeRelatedEntityFromRecordedEvents } from "^redux/state/recordedEvents";

import { EntityName, RelatedEntityFields } from "^types/entity";

type EntityNames = Exclude<EntityName, "recordedEventType">;

type Props = {
  entity: {
    id: string;
    name: EntityNames;
  };
  relatedEntities: Partial<RelatedEntityFields<EntityNames>>;
};

const useUpdateRelatedEntitiesOfDeletedEntity = ({
  entity: { id: entityId, name: entityName },
  relatedEntities: {
    articlesIds,
    authorsIds,
    blogsIds,
    collectionsIds,
    recordedEventsIds,
    subjectsIds,
    tagsIds,
  },
}: Props) => {
  const dispatch = useDispatch();

  const updateRelatedEntitiesOnDelete = () => {
    if (authorsIds) {
      authorsIds.forEach((authorId) =>
        dispatch(
          removeRelatedEntityFromAuthor({
            id: authorId,
            relatedEntity: { id: entityId, name: entityName },
          })
        )
      );
      for (let i = 0; i < authorsIds.length; i++) {
        const authorId = authorsIds[i];
        dispatch(
          removeRelatedEntityFromAuthor({
            id: authorId,
            relatedEntityId: entityId,
          })
        );
      }
    }
  };

  return;
};

export default useUpdateRelatedEntitiesOfDeletedEntity;

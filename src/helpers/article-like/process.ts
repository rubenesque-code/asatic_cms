import produce from "immer";
import { Article } from "^types/article";
import { Blog } from "^types/blog";

export function unshiftFirstEntityWithImage(entities: (Article | Blog)[]) {
  const hasStorageImageIndex = entities.findIndex(
    (entity) => entity.summaryImage?.imageId
  );

  if (hasStorageImageIndex > -1) {
    const entity = entities[hasStorageImageIndex];

    const a = produce(entities, (draft) => {
      draft.splice(hasStorageImageIndex, 1);
      draft.unshift(entity);
    });

    return a;
  }

  return entities;
}

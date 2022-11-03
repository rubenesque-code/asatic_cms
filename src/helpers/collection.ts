import { Collection } from "^types/collection";

export function getRelatedEntitiesIds(
  relatedEntities: Collection["relatedEntities"],
  type: Collection["relatedEntities"][number]["type"]
) {
  return relatedEntities
    .filter((re) => re.type === type)
    .flatMap((re) => re.entityId);
}

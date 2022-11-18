import $Empty from "./_presentation/$Empty";

import { DisplayEntityPopover_ } from "^components/rich-popover/display-entity";
import SubjectSlice from "^context/subjects/SubjectContext";

const Empty = () => {
  const [
    { id: subjectId, articlesIds, blogsIds, collectionsIds, recordedEventsIds },
    { addRelatedEntity },
  ] = SubjectSlice.useContext();

  return (
    <$Empty
      addEntityPopover={(button) => (
        <DisplayEntityPopover_
          parentEntity={{
            actions: {
              addDisplayEntity: (relatedEntity) =>
                addRelatedEntity({ relatedEntity }),
            },
            data: {
              existingEntities: {
                articlesIds,
                blogsIds,
                collectionsIds,
                recordedEventsIds,
              },
              id: subjectId,
              name: "subject",
            },
          }}
        >
          {button}
        </DisplayEntityPopover_>
      )}
    />
  );
};

export default Empty;

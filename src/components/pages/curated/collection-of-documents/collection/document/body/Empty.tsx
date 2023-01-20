import $Empty from "./_presentation/$Empty";

import { DocumentEntityPopover_ } from "^components/rich-popover/document-entity";
import CollectionSlice from "^context/collections/CollectionContext";
import { toast } from "react-toastify";

const Empty = () => {
  const [
    { id, languageId, articlesIds, blogsIds, recordedEventsIds },
    { addRelatedEntity },
  ] = CollectionSlice.useContext();

  return (
    <$Empty
      addPrimaryEntityPopover={(button) => (
        <DocumentEntityPopover_
          parentEntity={{
            actions: {
              addEntity: (entity) => {
                addRelatedEntity({ relatedEntity: entity });
                toast.success("Added");
              },
            },
            data: {
              existingEntitiesIds: {
                articles: articlesIds,
                blogs: blogsIds,
                recordedEvents: recordedEventsIds,
              },
              name: "collection",
              limitToLanguageId: languageId,
              id,
            },
          }}
        >
          {button}
        </DocumentEntityPopover_>
      )}
    />
  );
};

export default Empty;

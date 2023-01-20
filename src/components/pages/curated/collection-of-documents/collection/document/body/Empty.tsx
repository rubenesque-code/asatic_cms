import $Empty from "./_presentation/$Empty";

import { DocumentEntityPopover_ } from "^components/rich-popover/document-entity";
import CollectionSlice from "^context/collections/CollectionContext";
import { toast } from "react-toastify";

const Empty = () => {
  const [{ id, languageId }, { addRelatedEntity }] =
    CollectionSlice.useContext();

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

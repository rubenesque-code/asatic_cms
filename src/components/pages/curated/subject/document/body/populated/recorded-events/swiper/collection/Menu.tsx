import SubjectSlice from "^context/subjects/SubjectContext";
import CollectionSlice from "^context/collections/CollectionContext";

import { EntityMenu_ } from "../../../_container";

const CollectionMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    { id: subjectId },
    { removeRelatedEntity: removeRelatedEntityFromSubject },
  ] = SubjectSlice.useContext();
  const [
    { id: collectionId },
    { removeRelatedEntity: removeRelatedEntityFromCollection, routeToEditPage },
  ] = CollectionSlice.useContext();

  const handleRemoveCollection = () => {
    removeRelatedEntityFromSubject({
      relatedEntity: { id: collectionId, name: "collection" },
    });
    removeRelatedEntityFromCollection({
      relatedEntity: { id: subjectId, name: "subject" },
    });
  };

  return (
    <EntityMenu_
      isShowing={isShowing}
      removeEntity={() => handleRemoveCollection()}
      routeToEntityPage={routeToEditPage}
    />
  );
};

export default CollectionMenu;

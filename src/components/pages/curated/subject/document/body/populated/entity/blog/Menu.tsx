import BlogSlice from "^context/blogs/BlogContext";
import SubjectSlice from "^context/subjects/SubjectContext";

import { EntityMenu_ } from "../_container";

const BlogMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    { id: subjectId },
    { removeRelatedEntity: removeRelatedEntityFromSubject },
  ] = SubjectSlice.useContext();
  const [
    { id: blogId },
    { removeRelatedEntity: removeRelatedEntityFromBlog, routeToEditPage },
  ] = BlogSlice.useContext();

  const handleRemoveBlog = () => {
    removeRelatedEntityFromSubject({
      relatedEntity: { id: blogId, name: "blog" },
    });
    removeRelatedEntityFromBlog({
      relatedEntity: { id: subjectId, name: "subject" },
    });
  };

  return (
    <EntityMenu_
      isShowing={isShowing}
      removeEntity={() => handleRemoveBlog()}
      // extraButtons={}
      routeToEntityPage={routeToEditPage}
    />
  );
};

export default BlogMenu;

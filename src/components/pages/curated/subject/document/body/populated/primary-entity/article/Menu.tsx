import ArticleSlice from "^context/articles/ArticleContext";
import SubjectSlice from "^context/subjects/SubjectContext";

import { EntityMenu_ } from "../_container";

const ArticleMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [
    { id: subjectId },
    { removeRelatedEntity: removeRelatedEntityFromSubject },
  ] = SubjectSlice.useContext();
  const [
    { id: articleId },
    { removeRelatedEntity: removeRelatedEntityFromArticle, routeToEditPage },
  ] = ArticleSlice.useContext();

  const handleRemoveArticle = () => {
    removeRelatedEntityFromSubject({
      relatedEntity: { id: articleId, name: "article" },
    });
    removeRelatedEntityFromArticle({
      relatedEntity: { id: subjectId, name: "subject" },
    });
  };

  return (
    <EntityMenu_
      isShowing={isShowing}
      removeEntity={() => handleRemoveArticle()}
      // extraButtons={}
      routeToEntityPage={routeToEditPage}
    />
  );
};

export default ArticleMenu;

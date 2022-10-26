import ArticleSlice from "^context/articles/ArticleContext";

import ArticleLikeMenu_ from "../_containers/ArticleLikeMenu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ summaryImage }, { routeToEditPage, toggleUseSummaryImage }] =
    ArticleSlice.useContext();

  return (
    <ArticleLikeMenu_
      isShowing={isShowing}
      routeToEntityPage={routeToEditPage}
      toggleUseImageOn={toggleUseSummaryImage}
      usingImage={summaryImage.useImage}
    />
  );
};

export default Menu;

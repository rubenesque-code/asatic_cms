import BlogSlice from "^context/blogs/BlogContext";

import ArticleLikeMenu_ from "../_containers/ArticleLikeMenu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ summaryImage }, { routeToEditPage, toggleUseSummaryImage }] =
    BlogSlice.useContext();

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

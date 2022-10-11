import ArticleSlice from "^context/articles/ArticleContext";

import { Menu_ } from "../../../_containers/Entity";

const ArticleMenu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ summaryImage }, { routeToEditPage, toggleUseSummaryImage }] =
    ArticleSlice.useContext();

  return (
    <Menu_
      isShowing={isShowing}
      routeToEditPage={routeToEditPage}
      toggleUseImage={
        !summaryImage.useImage
          ? {
              isUsingImage: summaryImage.useImage,
              toggleUseImage: toggleUseSummaryImage,
            }
          : undefined
      }
    />
  );
};

export default ArticleMenu;

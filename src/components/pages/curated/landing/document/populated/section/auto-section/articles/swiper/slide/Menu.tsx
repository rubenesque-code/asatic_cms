import ArticleSlice from "^context/articles/ArticleContext";

import { Menu_ } from "../../../_containers/Entity_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
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

export default Menu;

import ArticleSlice from "^context/articles/ArticleContext";

import { Menu_ } from "../../../../_containers/Menu_";
import { ToggleUseImageButton_ } from "^components/pages/curated/_containers/ImageMenu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ summaryImage }, { routeToEditPage, toggleUseSummaryImage }] =
    ArticleSlice.useContext();

  return (
    <Menu_
      isShowing={isShowing}
      routeToEditPage={routeToEditPage}
      extraButtons={
        !summaryImage.useImage ? (
          <ToggleUseImageButton_ toggleUseImage={toggleUseSummaryImage} />
        ) : null
      }
    />
  );
};

export default Menu;

import ArticleSlice from "^context/articles/ArticleContext";

import { MenuPopulated_ } from "../_containers/Menu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ summaryImage }, { routeToEditPage, toggleUseSummaryImage }] =
    ArticleSlice.useContext();

  return (
    <MenuPopulated_
      isShowing={isShowing}
      routeToEntityPage={routeToEditPage}
      toggleUseImageOn={toggleUseSummaryImage}
      usingImage={Boolean(summaryImage.useImage)}
    />
  );
};

export default Menu;

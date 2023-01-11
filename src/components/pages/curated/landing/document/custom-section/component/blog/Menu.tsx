import BlogSlice from "^context/blogs/BlogContext";

import { MenuPopulated_ } from "../_containers/Menu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [{ summaryImage }, { routeToEditPage, toggleUseSummaryImage }] =
    BlogSlice.useContext();

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

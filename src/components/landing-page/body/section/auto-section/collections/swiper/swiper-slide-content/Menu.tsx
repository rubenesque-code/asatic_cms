import CollectionSlice from "^context/collections/CollectionContext";

import { Menu_ } from "../../../_containers/Entity";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [, { routeToEditPage }] = CollectionSlice.useContext();

  return <Menu_ isShowing={isShowing} routeToEditPage={routeToEditPage} />;
};

export default Menu;

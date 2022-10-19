import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import { Menu_ } from "../../../_containers/Entity_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [, { routeToEditPage }] = RecordedEventSlice.useContext();

  return <Menu_ isShowing={isShowing} routeToEditPage={routeToEditPage} />;
};

export default Menu;

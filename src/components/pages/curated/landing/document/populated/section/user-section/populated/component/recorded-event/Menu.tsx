import RecordedEventSlice from "^context/recorded-events/RecordedEventContext";

import Menu_ from "../_containers/Menu_";

const Menu = ({ isShowing }: { isShowing: boolean }) => {
  const [, { routeToEditPage }] = RecordedEventSlice.useContext();

  return <Menu_ isShowing={isShowing} routeToEntityPage={routeToEditPage} />;
};

export default Menu;

import { $Container_ } from "../../../../_presentation/$Entity_";
import Menu from "./Menu";
import Status from "./Status";
import Summary from "./Summary";

const Content = () => {
  return (
    <$Container_>
      {(isHovered) => (
        <>
          <Status />
          <Summary />
          <Menu isShowing={isHovered} />
        </>
      )}
    </$Container_>
  );
};

export default Content;

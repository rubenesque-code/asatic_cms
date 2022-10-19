import { Container_ } from "../../../_containers/Entity_";
import Menu from "./Menu";
import Status from "./Status";
import Summary from "./Summary";

const Article = () => {
  return (
    <Container_>
      {(isHovered) => (
        <>
          <Status />
          <Summary />
          <Menu isShowing={isHovered} />
        </>
      )}
    </Container_>
  );
};

export default Article;
